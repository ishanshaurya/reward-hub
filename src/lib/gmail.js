// lib/gmail.js
// RewardHub — Gmail API fetch module
// Handles: search, fetch, decode, and strip email bodies

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

// Master search query — matches reward emails from all supported apps
const SEARCH_QUERY = `(cashback OR refund OR reward OR coupon OR "cash back" OR "points earned" OR "money credited" OR "amount credited" OR "scratch card" OR expires OR expiring)`;

/**
 * Search Gmail for reward-related emails.
 * Returns an array of message stubs: [{ id, threadId }, ...]
 *
 * @param {string} accessToken  - Google OAuth access token from Supabase session
 * @param {number} maxResults   - Max emails to fetch (default: 100)
 * @param {function} onProgress - Optional callback(fetched, total)
 */
export async function searchRewardEmails(accessToken, maxResults = 100, onProgress) {
  const allMessages = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({
      q: SEARCH_QUERY,
      maxResults: Math.min(maxResults - allMessages.length, 50), // Gmail max per page = 500, but 50 is safe
    });
    if (pageToken) params.set("pageToken", pageToken);

    console.log("[Gmail] Starting search with token:", accessToken?.slice(0,20) + "...");
    const res = await fetch(`${GMAIL_BASE}/messages?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("[Gmail] Search response status:", res.status);

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Gmail search failed: ${err.error?.message || res.statusText}`);
    }

    const data = await res.json();
    console.log("[Gmail] Raw search result:", JSON.stringify(data).slice(0, 500));
    const messages = data.messages || [];
    allMessages.push(...messages);

    onProgress?.(allMessages.length, data.resultSizeEstimate || allMessages.length);

    pageToken = data.nextPageToken || null;
  } while (pageToken && allMessages.length < maxResults);

  console.log("[Gmail] Messages found:", allMessages.length);
  return allMessages;
}

/**
 * Fetch a single email's full content by message ID.
 * Returns a structured object: { id, from, subject, date, body }
 *
 * @param {string} accessToken - Google OAuth access token
 * @param {string} messageId   - Gmail message ID
 */
export async function fetchEmailById(accessToken, messageId) {
  const res = await fetch(`${GMAIL_BASE}/messages/${messageId}?format=full`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to fetch email ${messageId}: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return parseEmailPayload(data);
}

/**
 * Batch fetch multiple emails concurrently (with rate-limit throttle).
 * Returns array of structured email objects.
 *
 * @param {string}   accessToken - Google OAuth access token
 * @param {Array}    messageStubs - Array of { id } objects from searchRewardEmails
 * @param {function} onProgress  - Optional callback(done, total)
 * @param {number}   concurrency - How many parallel requests (default: 5)
 */
export async function fetchEmailsBatch(accessToken, messageStubs, onProgress, concurrency = 5) {
  const results = [];
  let done = 0;

  // Process in chunks to avoid hammering the API
  for (let i = 0; i < messageStubs.length; i += concurrency) {
    const chunk = messageStubs.slice(i, i + concurrency);

    const chunkResults = await Promise.allSettled(
      chunk.map((msg) => fetchEmailById(accessToken, msg.id))
    );

    for (const result of chunkResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
      // Silently skip failed individual fetches — don't block the whole sync
    }

    done += chunk.length;
    onProgress?.(done, messageStubs.length);

    // Small delay between chunks to respect Gmail quota (250 units/sec)
    if (i + concurrency < messageStubs.length) {
      await sleep(200);
    }
  }

  return results;
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Parse a raw Gmail API message object into a clean { id, from, subject, date, body, snippet }.
 */
function parseEmailPayload(message) {
  const headers = message.payload?.headers || [];

  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  const from = getHeader("From");
  const subject = getHeader("Subject");
  const dateStr = getHeader("Date");
  const date = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();

  const rawBody = extractBodyFromPayload(message.payload);
  const body = stripHtml(rawBody);

  return {
    id: message.id,
    threadId: message.threadId,
    from,
    subject,
    date,
    body,
    snippet: message.snippet || "",
  };
}

/**
 * Recursively extract the email body from a Gmail payload.
 * Prefers text/plain over text/html. Falls back to snippet.
 */
function extractBodyFromPayload(payload) {
  if (!payload) return "";

  // Direct body data (simple single-part email)
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Multipart email — recurse into parts
  if (payload.parts?.length) {
    // Prefer plain text part
    const plainPart = payload.parts.find((p) => p.mimeType === "text/plain");
    if (plainPart?.body?.data) return decodeBase64Url(plainPart.body.data);

    // Fall back to HTML part
    const htmlPart = payload.parts.find((p) => p.mimeType === "text/html");
    if (htmlPart?.body?.data) return decodeBase64Url(htmlPart.body.data);

    // Nested multipart — recurse
    for (const part of payload.parts) {
      if (part.mimeType?.startsWith("multipart/")) {
        const nested = extractBodyFromPayload(part);
        if (nested) return nested;
      }
    }
  }

  return "";
}

/**
 * Decode Gmail's base64url-encoded string to plain text.
 * Gmail uses base64url (- and _ instead of + and /).
 */
function decodeBase64Url(encoded) {
  try {
    // Replace base64url chars with standard base64 chars
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    return atob(base64);
  } catch {
    return "";
  }
}

/**
 * Strip HTML tags and decode common HTML entities.
 * Leaves plain text suitable for regex parsing.
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ") // Remove style blocks
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ") // Remove script blocks
    .replace(/<[^>]+>/g, " ") // Strip all tags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s{2,}/g, " ") // Collapse whitespace
    .trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
