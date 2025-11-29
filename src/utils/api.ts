const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const functionSlug = import.meta.env.VITE_EDGE_FUNCTION_SLUG || 'make-server-6a458d4b';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/${functionSlug}`;

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
    if (!projectId || !publicAnonKey) {
      console.error('[API Config] Missing Supabase env vars. Check VITE_SUPABASE_PROJECT_ID and VITE_SUPABASE_ANON_KEY');
    }

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
      console.error(`[API Error] ${endpoint} (${response.status}):`, data.error || 'Unknown error');
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
  // OTP endpoints
  sendOTP: async (mobile: string) => {
    return apiRequest<{ otp: string }>('/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  verifyOTP: async (mobile: string, otp: string, name?: string) => {
    return apiRequest<{ id: string; name: string; mobile: string }>('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, name }),
    });
  },

  // Customer endpoints
  getCustomer: async (customerId: string) => {
    return apiRequest(`/customer/${customerId}`);
  },

  addPurchase: async (customerId: string, items: string[]) => {
    return apiRequest(`/customer/${customerId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  completeRoadmap: async (customerId: string, roadmapId: string, badge: string) => {
    return apiRequest(`/customer/${customerId}/complete-roadmap`, {
      method: 'POST',
      body: JSON.stringify({ roadmapId, badge }),
    });
  },

  // Barista endpoints
  searchCustomer: async (mobile: string) => {
    return apiRequest(`/barista/search/${mobile}`);
  },

  baristaAddPurchase: async (mobile: string, items: string[]) => {
    return apiRequest('/barista/add-purchase', {
      method: 'POST',
      body: JSON.stringify({ mobile, items }),
    });
  },

  // Health check
  healthCheck: async () => {
    return apiRequest('/health');
  },
};
