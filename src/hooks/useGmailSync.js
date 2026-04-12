// src/hooks/useGmailSync.js
// RewardHub — Gmail sync hook
// FIX: handleError moved inside the hook so it has access to setSyncState

import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { searchRewardEmails, fetchEmailById } from "../lib/gmail";
import { parseEmailBatch } from "../lib/parser";

const INITIAL_STATE = {
    status: "idle",       // idle | syncing | done | error
    found: 0,             // emails matched by search query
    fetched: 0,           // email bodies downloaded
    parsed: 0,            // rewards extracted
    saved: 0,             // rows inserted into Supabase
    skipped: 0,           // duplicates skipped
    errorMessage: null,
};

export function useGmailSync() {
    const [syncState, setSyncState] = useState(INITIAL_STATE);

    // ── handleError is INSIDE the hook so it closes over setSyncState ──
    const handleError = useCallback((err, context = "") => {
        console.error(`[useGmailSync] ${context}`, err);
        setSyncState((prev) => ({
            ...prev,
            status: "error",
            errorMessage: err?.message || "An unexpected error occurred",
        }));
    }, []);

    const startSync = useCallback(async () => {
        // 1. Get current session + Gmail access token
        const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

        if (sessionError || !sessionData?.session) {
            handleError(
                new Error("Not signed in. Please sign in with Google first."),
                "getSession"
            );
            return;
        }

        const accessToken = sessionData.session.provider_token;
        const userId = sessionData.session.user.id;

        if (!accessToken) {
            handleError(
                new Error(
                    "Gmail access token not found. Please sign out and sign in again."
                ),
                "provider_token"
            );
            return;
        }

        // 2. Start sync — reset state
        setSyncState({ ...INITIAL_STATE, status: "syncing" });

        try {
            // 3. Search Gmail for reward emails
            const messageStubs = await searchRewardEmails(accessToken);
            const totalFound = messageStubs.length;

            setSyncState((prev) => ({ ...prev, found: totalFound }));

            if (totalFound === 0) {
                setSyncState((prev) => ({ ...prev, status: "done" }));
                return;
            }

            // 4. Create sync log entry
            const { data: syncLog } = await supabase
                .from("sync_logs")
                .insert({ user_id: userId, emails_fetched: totalFound })
                .select()
                .single();

            const syncLogId = syncLog?.id;

            // 5. Process emails one by one
            for (let i = 0; i < messageStubs.length; i++) {
                const stub = messageStubs[i];

                try {
                    // Fetch full email body
                    const emailData = await fetchEmailById(accessToken, stub.id);

                    setSyncState((prev) => ({ ...prev, fetched: prev.fetched + 1 }));

                    // Parse into reward objects
                    const rewards = parseEmailBatch(emailData);

                    if (!rewards || rewards.length === 0) continue;

                    setSyncState((prev) => ({
                        ...prev,
                        parsed: prev.parsed + rewards.length,
                    }));

                    // 6. Save each reward to Supabase (dedup via unique constraint)
                    for (const reward of rewards) {
                        const { error: insertError } = await supabase
                            .from("rewards")
                            .insert({
                                user_id: userId,
                                gmail_message_id: stub.id,
                                app_name: reward.app,
                                reward_type: reward.type,
                                amount: reward.amount ?? null,
                                coupon_code: reward.couponCode ?? null,
                                email_date: reward.date,
                                expiry_date: reward.expiry ?? null,
                                subject_line: reward.subject ?? null,
                                snippet: reward.snippet ?? null,
                            });

                        if (insertError) {
                            // Code 23505 = unique_violation (duplicate) — skip silently
                            if (insertError.code === "23505") {
                                setSyncState((prev) => ({
                                    ...prev,
                                    skipped: prev.skipped + 1,
                                }));
                            } else {
                                console.warn("[useGmailSync] Insert warning:", insertError);
                            }
                        } else {
                            setSyncState((prev) => ({ ...prev, saved: prev.saved + 1 }));
                        }
                    }
                } catch (emailErr) {
                    // Individual email failure — log and continue, don't abort the sync
                    console.warn(`[useGmailSync] Failed to process email ${stub.id}:`, emailErr);
                }
            }

            // 7. Update sync log as completed
            if (syncLogId) {
                await supabase
                    .from("sync_logs")
                    .update({
                        status: "completed",
                        sync_completed_at: new Date().toISOString(),
                    })
                    .eq("id", syncLogId);
            }

            setSyncState((prev) => ({ ...prev, status: "done" }));
        } catch (err) {
            handleError(err, "startSync");

            // Try to mark sync log as failed
            try {
                await supabase
                    .from("sync_logs")
                    .update({ status: "failed" })
                    .eq("user_id", userId)
                    .eq("status", "in_progress");
            } catch (_) {
                // best-effort, ignore
            }
        }
    }, [handleError]);

    const resetSync = useCallback(() => {
        setSyncState(INITIAL_STATE);
    }, []);

    return { syncState, startSync, resetSync };
}