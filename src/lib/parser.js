// lib/parser.js
// RewardHub — Regex Parsing Engine
// Takes a parsed email object and extracts structured reward data

// ─── Regex Patterns ───────────────────────────────────────────────────────────

// Cashback: "Cashback of ₹50", "₹25 cashback credited", "cashback of Rs 75"
const CASHBACK_REGEX =
  /(?:cashback|cash back)\s*(?:of\s*)?(?:₹|Rs\.?\s*)(\d+(?:\.\d{1,2})?)|(?:₹|Rs\.?\s*)(\d+(?:\.\d{1,2})?)\s*(?:cashback|cash back)/gi;

// Reward Points: "50 reward points", "earned 100 points", "200 SuperCoins"
const REWARD_POINTS_REGEX =
  /(?:earned?\s*)?(\d+)\s*(?:reward\s*)?(?:points?|supercoins?|coins?)|(?:points?|supercoins?)\s*(?:earned?|credited)\s*:?\s*(\d+)/gi;

// Coupon: "Coupon: SAVE50", "Use code FLAT100", "voucher worth ₹200"
const COUPON_REGEX =
  /(?:coupon|code|voucher|promo)\s*:?\s*([A-Z0-9]{4,15})|(?:voucher|coupon)\s*(?:worth|of)\s*(?:₹|Rs\.?\s*)(\d+)/gi;

// Refund: "Refund of ₹150", "₹200 refunded", "refund processed: Rs.99"
const REFUND_REGEX =
  /refund(?:ed)?\s*(?:of\s*)?(?:₹|Rs\.?\s*)(\d+(?:\.\d{1,2})?)|(?:₹|Rs\.?\s*)(\d+(?:\.\d{1,2})?)\s*(?:refund|refunded)/gi;

// Expiry: "expires on 25 Dec 2025", "valid till 31/01/2026", "expiring in 3 days"
const EXPIRY_REGEX =
  /(?:expires?|valid\s*till|expir(?:ing|y)|expiry\s*date)\s*(?:on|by|:)?\s*(\d{1,2}[\s\/-]\w{3,9}[\s\/-]\d{2,4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|expir(?:ing|es?)\s*in\s*(\d+)\s*days?/gi;

// General amount (fallback)
const AMOUNT_REGEX = /(?:₹|Rs\.?\s*)(\d+(?:,\d{3})*(?:\.\d{1,2})?)/g;

// ─── App Detection ────────────────────────────────────────────────────────────

/**
 * Detect which payment app sent this email.
 * @param {string} from    - Sender email address
 * @param {string} subject - Email subject line
 * @param {string} body    - Decoded email body (plain text)
 * @returns {string} App name: 'Paytm' | 'PhonePe' | 'Google Pay' | 'Amazon Pay' | 'Swiggy' | 'Zomato' | 'Other'
 */
export function detectApp(from, subject, body) {
  const text = `${from} ${subject} ${body}`.toLowerCase();

  // Banks
  if (text.includes('axis bank') || text.includes('axisbank')) return 'Axis Bank';
  if (text.includes('hdfc')) return 'HDFC Bank';
  if (text.includes('icici')) return 'ICICI Bank';
  if (text.includes('sbi') || text.includes('state bank')) return 'SBI';
  if (text.includes('kotak')) return 'Kotak Bank';

  // Shopping cashback
  if (text.includes('zingoy')) return 'Zingoy';
  if (text.includes('cashkaro')) return 'CashKaro';

  // E-commerce
  if (text.includes('flipkart')) return 'Flipkart';
  if (text.includes('myntra')) return 'Myntra';
  if (text.includes('nykaa')) return 'Nykaa';
  if (text.includes('meesho')) return 'Meesho';

  // Travel
  if (text.includes('makemytrip') || text.includes('mmt')) return 'MakeMyTrip';
  if (text.includes('goibibo')) return 'Goibibo';
  if (text.includes('irctc')) return 'IRCTC';

  // Food/Grocery
  if (text.includes('blinkit')) return 'Blinkit';
  if (text.includes('bigbasket')) return 'BigBasket';
  if (text.includes('zepto')) return 'Zepto';

  // Original UPI apps
  if (text.includes('paytm')) return 'Paytm';
  if (text.includes('phonepe')) return 'PhonePe';
  if (text.includes('google pay') || text.includes('gpay')) return 'Google Pay';
  if (text.includes('amazon')) return 'Amazon Pay';
  if (text.includes('swiggy')) return 'Swiggy';
  if (text.includes('zomato')) return 'Zomato';

  return 'Other';
}

// ─── Reward Type Classification ───────────────────────────────────────────────

/**
 * Classify the reward type from email content.
 * @param {string} subject - Email subject
 * @param {string} body    - Email body (plain text)
 * @returns {string} 'refund' | 'cashback' | 'coupon' | 'points' | 'other'
 */
export function classifyReward(subject, body) {
  const text = `${subject} ${body}`.toLowerCase();

  // Order matters — refund before cashback (some refund emails mention cashback)
  if (/refund/i.test(text)) return "refund";
  if (/cashback|cash back/i.test(text)) return "cashback";
  if (/coupon|voucher|promo|code/i.test(text)) return "coupon";
  if (/reward|points?|coins?/i.test(text)) return "points";
  if (/scratch card/i.test(text)) return "cashback";
  if (/offer|discount/i.test(text)) return "coupon";

  return "other";
}

// ─── Amount Extraction ────────────────────────────────────────────────────────

/**
 * Extract the most relevant monetary amount from email content.
 * Strategy: run type-specific regex first, fall back to general amount regex.
 *
 * @param {string} subject      - Email subject
 * @param {string} body         - Email body (plain text)
 * @param {string} rewardType   - Output of classifyReward()
 * @returns {number|null}       - Amount as float, or null if not found
 */
export function extractAmount(subject, body, rewardType) {
  const text = `${subject} ${body}`;

  let match = null;

  if (rewardType === "cashback") {
    CASHBACK_REGEX.lastIndex = 0;
    match = CASHBACK_REGEX.exec(text);
    if (match) return parseFloat(match[1] || match[2]);
  }

  if (rewardType === "refund") {
    REFUND_REGEX.lastIndex = 0;
    match = REFUND_REGEX.exec(text);
    if (match) return parseFloat(match[1] || match[2]);
  }

  if (rewardType === "points") {
    REWARD_POINTS_REGEX.lastIndex = 0;
    match = REWARD_POINTS_REGEX.exec(text);
    if (match) return parseFloat(match[1] || match[2]);
  }

  // Coupon with value: "voucher worth ₹200"
  if (rewardType === "coupon") {
    COUPON_REGEX.lastIndex = 0;
    const couponMatch = COUPON_REGEX.exec(text);
    if (couponMatch && couponMatch[2]) return parseFloat(couponMatch[2]);
  }

  // General fallback — pick the largest amount found (usually the reward value)
  AMOUNT_REGEX.lastIndex = 0;
  const allAmounts = [];
  let generalMatch;
  while ((generalMatch = AMOUNT_REGEX.exec(text)) !== null) {
    const val = parseFloat(generalMatch[1].replace(/,/g, ""));
    if (!isNaN(val) && val > 0) allAmounts.push(val);
  }

  if (allAmounts.length > 0) {
    // Heuristic: reward amounts are usually between ₹1 and ₹10,000
    // Filter out suspicious huge numbers (order totals, etc.)
    const reasonable = allAmounts.filter((a) => a >= 1 && a <= 10000);
    return reasonable.length > 0 ? Math.max(...reasonable) : null;
  }

  return null;
}

// ─── Coupon Code Extraction ───────────────────────────────────────────────────

/**
 * Extract a coupon/promo code from email content.
 * Returns null for non-coupon rewards.
 *
 * @param {string} subject    - Email subject
 * @param {string} body       - Email body (plain text)
 * @param {string} rewardType - Output of classifyReward()
 * @returns {string|null}
 */
export function extractCouponCode(subject, body, rewardType) {
  if (rewardType !== "coupon") return null;

  const text = `${subject} ${body}`;
  COUPON_REGEX.lastIndex = 0;

  const match = COUPON_REGEX.exec(text);
  if (match && match[1] && /^[A-Z0-9]{4,15}$/.test(match[1])) {
    return match[1];
  }

  return null;
}

// ─── Expiry Date Extraction ───────────────────────────────────────────────────

/**
 * Extract an expiry date from email content.
 * Returns ISO date string (YYYY-MM-DD) or null.
 *
 * @param {string} subject   - Email subject
 * @param {string} body      - Email body (plain text)
 * @param {string} emailDate - ISO string of when the email was sent (for "expiring in X days")
 * @returns {string|null}
 */
export function extractExpiry(subject, body, emailDate) {
  const text = `${subject} ${body}`;
  EXPIRY_REGEX.lastIndex = 0;

  const match = EXPIRY_REGEX.exec(text);
  if (!match) return null;

  // "expiring in X days" — relative date
  if (match[2]) {
    const days = parseInt(match[2], 10);
    const base = new Date(emailDate || Date.now());
    base.setDate(base.getDate() + days);
    return base.toISOString().split("T")[0];
  }

  // Absolute date string — try to parse
  if (match[1]) {
    // Handle DD/MM/YYYY or DD-MM-YYYY → convert to parseable format
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(match[1])) {
      const [day, month, year] = match[1].split(/[\/\-]/);
      return new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`).toISOString().split('T')[0];
    }

    const parsed = new Date(match[1]);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
  }

  return null;
}

// ─── Main Parse Function ──────────────────────────────────────────────────────

/**
 * Parse a single email into a structured reward object.
 * Returns null if the email doesn't contain a recognizable reward.
 *
 * @param {Object} email - { id, from, subject, date, body, snippet }
 * @returns {Object|null} Reward object ready to insert into Supabase
 */
export function parseEmailToReward(email) {
  const { id, from, subject, date, body, snippet } = email;

  const app = detectApp(from, subject, body);
  const type = classifyReward(subject, body);

  // Skip emails we can't classify
  if (type === "other" && app === "Other") return null;

  const amount = extractAmount(subject, body, type);
  const couponCode = extractCouponCode(subject, body, type);
  const expiryDate = extractExpiry(subject, body, date);

  // Skip if no useful data extracted
  if (!amount && !couponCode) return null;

  return {
    gmail_message_id: id,
    app_name: app,
    reward_type: type,
    amount: amount || null,
    coupon_code: couponCode || null,
    email_date: date,
    expiry_date: expiryDate || null,
    subject_line: subject,
    snippet: snippet || body.slice(0, 200),
    is_expired: expiryDate ? new Date(expiryDate) < new Date() : false,
    is_claimed: false,
  };
}

/**
 * Parse a batch of emails.
 * Filters out nulls automatically.
 *
 * @param {Array} emails - Array of email objects from gmail.js
 * @returns {Array} Array of reward objects
 */
export function parseEmailBatch(emails) {
  if (!Array.isArray(emails)) emails = [emails]; // defensive fix
  return emails.map(parseEmailToReward).filter(Boolean);
}
