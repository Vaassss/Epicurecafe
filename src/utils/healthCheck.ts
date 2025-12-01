import { api } from './api';

export interface HealthStatus {
  isHealthy: boolean;
  message: string;
  timestamp?: string;
}

/**
 * Check if the backend server is healthy and reachable
 */
export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const response = await api.healthCheck();
    
    if (response.error) {
      return {
        isHealthy: false,
        message: `Backend error: ${response.error}`,
      };
    }

    return {
      isHealthy: true,
      message: 'Backend is healthy',
      timestamp: (response as any).timestamp,
    };
  } catch (error) {
    return {
      isHealthy: false,
      message: 'Cannot reach backend server',
    };
  }
}

/**
 * Run health check and log to console
 */
export async function logHealthStatus(): Promise<void> {
  console.log('[Health Check] Checking backend status...');
  const status = await checkBackendHealth();
  
  if (status.isHealthy) {
    console.log('✅ [Health Check] Backend is operational', status);
  } else {
    console.error('❌ [Health Check] Backend is not healthy', status);
  }
}
