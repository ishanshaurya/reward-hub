// src/lib/ErrorHandler.js
// RewardHub — Centralized error handling + toast notifications

import { useState, useEffect } from 'react';

export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Sign in failed. Please try again.',
  AUTH_POPUP_BLOCKED: 'Sign in popup was blocked. Please allow popups and try again.',
  NO_AUTH: 'You must be signed in to sync rewards.',
  SESSION_EXPIRED: 'Your session expired. Please sign in again.',
  GMAIL_NO_PERMISSION: 'Gmail access not granted. Please sign in again with Gmail permissions.',
  GMAIL_RATE_LIMITED: 'Too many requests to Gmail. Please wait a few minutes and try again.',
  GMAIL_FETCH_FAILED: 'Failed to fetch emails. Please check your internet and try again.',
  PARSE_FAILED: 'Error parsing rewards. This might be a temporary issue.',
  NO_REWARDS_FOUND: 'No rewards found in recent emails. Check your email filters!',
  DB_SAVE_FAILED: 'Failed to save rewards. Please try again.',
  DB_LOAD_FAILED: 'Failed to load your rewards. Please refresh the page.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request took too long. Please try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

export class RewardHubError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', originalError = null) {
    super(message);
    this.name = 'RewardHubError';
    this.code = code;
    this.originalError = originalError;
  }
}

export function handleError(error) {
  if (error instanceof RewardHubError) {
    return {
      message: error.message,
      code: error.code,
      canRetry: ['GMAIL_RATE_LIMITED', 'TIMEOUT', 'NETWORK_ERROR'].includes(error.code),
    };
  }

  if (error.message?.includes('403')) {
    return { message: ERROR_MESSAGES.GMAIL_NO_PERMISSION, code: 'GMAIL_NO_PERMISSION', canRetry: false };
  }
  if (error.message?.includes('429')) {
    return { message: ERROR_MESSAGES.GMAIL_RATE_LIMITED, code: 'GMAIL_RATE_LIMITED', canRetry: true };
  }
  if (error instanceof TypeError || error.message?.includes('fetch')) {
    return { message: ERROR_MESSAGES.NETWORK_ERROR, code: 'NETWORK_ERROR', canRetry: true };
  }

  return { message: ERROR_MESSAGES.UNKNOWN_ERROR, code: 'UNKNOWN_ERROR', canRetry: true };
}

/**
 * Fire a toast notification via custom event.
 */
export function createToast(message, type = 'info', duration = 3000) {
  const toastId = Date.now();
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { id: toastId, message, type, duration },
  }));
  return toastId;
}

const TOAST_COLORS = {
  success: { bg: 'rgba(0,208,132,0.15)', border: 'rgba(0,208,132,0.4)', text: '#00D084' },
  error: { bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.4)', text: '#FF4757' },
  warning: { bg: 'rgba(240,165,0,0.12)', border: 'rgba(240,165,0,0.4)', text: '#F0A500' },
  info: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', text: '#3B82F6' },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { id, message, type, duration } = e.detail;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    };
    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '360px', pointerEvents: 'none' }}>
      {toasts.map((toast) => {
        const colors = TOAST_COLORS[toast.type] || TOAST_COLORS.info;
        return (
          <div
            key={toast.id}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontFamily: 'var(--font-primary)',
              fontSize: '13px',
              fontWeight: 500,
              padding: '12px 16px',
              borderRadius: '10px',
              backdropFilter: 'blur(12px)',
              animation: 'fadeInUp 0.3s ease-out',
              pointerEvents: 'auto',
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
