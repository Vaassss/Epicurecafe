import { projectId, publicAnonKey } from './supabase/info';
import { logger } from './logger';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6a458d4b`;

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
  customer?: T;
  message?: string;
  otp?: string;
}

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();
const CACHE_TTL = 1000; // 1 second - prevent duplicate requests

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  skipCache = false
): Promise<ApiResponse<T>> {
  try {
    // Create a cache key based on endpoint and method
    const cacheKey = `${options.method || 'GET'}_${endpoint}_${JSON.stringify(options.body || '')}`;
    
    // Return cached promise if request is already in-flight (unless explicitly skipped)
    if (!skipCache && requestCache.has(cacheKey)) {
      logger.api.request(endpoint, `${options.method || 'GET'} (CACHED)`);
      return requestCache.get(cacheKey);
    }
    
    logger.api.request(endpoint, options.method || 'GET');
    
    const requestPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Special case: "Name required" for new users is not really an error
        if (data.isNewUser) {
          logger.info('[API] New user detected, name required for registration');
          return { error: data.error || `Request failed with status ${response.status}`, ...data };
        }
        
        logger.api.error(endpoint, data.error || 'Unknown error');
        return { error: data.error || `Request failed with status ${response.status}`, ...data };
      }

      logger.api.success(endpoint, data);
      return data;
    })();

    // Cache the promise
    if (!skipCache) {
      requestCache.set(cacheKey, requestPromise);
      
      // Clear cache after TTL
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, CACHE_TTL);
    }

    return await requestPromise;
  } catch (error) {
    logger.api.error(endpoint, error);
    return { error: 'Network error. Please check your connection and try again.' };
  }
}

export const api = {
  // Health check
  healthCheck: () => apiRequest('/health'),

  // Check if customer exists
  checkCustomer: (mobile: string) => 
    apiRequest<{ exists: boolean; isNewUser: boolean }>(`/check-customer/${mobile}`),

  // Authentication
  sendOTP: (mobile: string) =>
    apiRequest<{ otp?: string }>('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    }),

  verifyOTP: (mobile: string, otp: string, name?: string) =>
    apiRequest<{ id: string; name: string; mobile: string }>('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, name }),
    }),

  // Customer endpoints
  getCustomer: (customerId: string) => {
    return apiRequest(`/customer/${customerId}`);
  },

  addPurchase: (customerId: string, items: string[]) => {
    return apiRequest(`/customer/${customerId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  completeRoadmap: (customerId: string, roadmapId: string, badge: string) => {
    return apiRequest(`/customer/${customerId}/complete-roadmap`, {
      method: 'POST',
      body: JSON.stringify({ roadmapId, badge }),
    });
  },

  // Barista endpoints
  searchCustomer: (mobile: string) => {
    return apiRequest(`/barista/search/${mobile}`);
  },

  baristaAddPurchase: (mobile: string, items: string[]) => {
    return apiRequest('/barista/add-purchase', {
      method: 'POST',
      body: JSON.stringify({ mobile, items }),
    });
  },

  // Scan bill
  scanBill: (customerId: string, items: string[], scannedText?: string, billHash?: string, staffCode?: string, invoiceNumber?: string) => {
    return apiRequest(`/customer/${customerId}/scan-bill`, {
      method: 'POST',
      body: JSON.stringify({ items, scannedText, billHash, staffCode, invoiceNumber }),
    });
  },

  // Verify staff code
  verifyStaffCode: (code: string) => {
    return apiRequest('/verify-staff-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Admin endpoints
  admin: {
    getAllCustomers: (adminMobile: string) => {
      return apiRequest('/admin/customers', {
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
      });
    },

    addPurchase: (adminMobile: string, customerMobile: string, items: string[]) => {
      return apiRequest(`/admin/customer/${customerMobile}/purchase`, {
        method: 'POST',
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
        body: JSON.stringify({ items, action: 'add' }),
      });
    },

    removePurchase: (adminMobile: string, customerMobile: string, purchaseId: string) => {
      return apiRequest(`/admin/customer/${customerMobile}/purchase`, {
        method: 'POST',
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
        body: JSON.stringify({ purchaseId, action: 'remove' }),
      });
    },

    addAdmin: (adminMobile: string, newAdminMobile: string, name?: string) => {
      return apiRequest('/admin/add-admin', {
        method: 'POST',
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
        body: JSON.stringify({ mobile: newAdminMobile, name }),
      });
    },

    removeAdmin: (adminMobile: string, targetMobile: string) => {
      return apiRequest('/admin/remove-admin', {
        method: 'POST',
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
        body: JSON.stringify({ mobile: targetMobile }),
      });
    },

    getAdmins: (adminMobile: string) => {
      return apiRequest('/admin/list-admins', {
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
      });
    },
  },
};