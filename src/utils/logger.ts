/**
 * Production-safe logger utility
 * Logs only in development, silent in production unless explicitly enabled
 */

// Safe environment check with fallbacks
const isDevelopment = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env !== undefined) {
      return import.meta.env.DEV === true;
    }
    // Fallback: check if running on localhost
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.port === '5173' ||
             window.location.port === '3000';
    }
    return false;
  } catch {
    return false;
  }
})();

const forceLogging = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env !== undefined) {
      return import.meta.env.VITE_FORCE_LOGGING === 'true';
    }
    return false;
  } catch {
    return false;
  }
})();

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment || forceLogging) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors
    console.error(...args);
  },

  warn: (...args: any[]) => {
    if (isDevelopment || forceLogging) {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment || forceLogging) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // API-specific logger
  api: {
    request: (endpoint: string, method: string) => {
      if (isDevelopment || forceLogging) {
        console.log(`[API] ${method} ${endpoint}`);
      }
    },

    success: (endpoint: string, data: any) => {
      if (isDevelopment || forceLogging) {
        console.log(`[API Success] ${endpoint}`, data);
      }
    },

    error: (endpoint: string, error: any) => {
      console.error(`[API Error] ${endpoint}`, error);
    },
  },
};