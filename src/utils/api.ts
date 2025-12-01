import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6a458d4b`;

interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
  customer?: T;
  message?: string;
  otp?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    console.log(`[API] Calling ${endpoint}`, options.method || 'GET');
    
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
        console.log('[API] New user detected, name required for registration');
        return { error: data.error || `Request failed with status ${response.status}`, ...data };
      }
      
      console.error(`[API Error] ${endpoint} (${response.status}):`, data.error || 'Unknown error');
      console.log('[API Error Response Full]:', data); // Debug: see full response
      return { error: data.error || `Request failed with status ${response.status}`, ...data };
    }

    console.log(`[API Success] ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`[Network Error] ${endpoint}:`, error);
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
  scanBill: (customerId: string, items: string[], scannedText?: string) => {
    return apiRequest(`/customer/${customerId}/scan-bill`, {
      method: 'POST',
      body: JSON.stringify({ items, scannedText }),
    });
  },
};