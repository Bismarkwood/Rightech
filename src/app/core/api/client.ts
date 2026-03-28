/**
 * Rightech Centralized API Client
 * 
 * This client handles all communication between the frontend and the 
 * (mock) backend. It includes built-in performance monitoring, 
 * auditing, and standardized error handling.
 */

export interface AuditMetadata {
  actorId: string;
  timestamp: string;
  action: string;
  module: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  audit?: AuditMetadata;
  latency: number;
}

class ApiClient {
  private baseUrl = '/api';
  private defaultActor = 'USR-MASTER-ADMIN'; // In a real app, this comes from AuthContext

  private async simulateNetworkLatency() {
    // Simulate 200ms - 800ms delay for "No Lagging" testing
    const delay = Math.floor(Math.random() * 600) + 200;
    await new Promise(resolve => setTimeout(resolve, delay));
    return delay;
  }

  private createAudit(action: string, module: string): AuditMetadata {
    return {
      actorId: this.defaultActor,
      timestamp: new Date().toISOString(),
      action,
      module,
    };
  }

  /**
   * Performs a mutation (POST, PUT, DELETE) with automatic auditing.
   */
  async mutate<T>(
    method: 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data: any,
    module: string
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    const latency = await this.simulateNetworkLatency();
    const action = `${method} ${endpoint}`;
    
    const audit = this.createAudit(action, module);
    
    // Log audit to "backend" (in our case, console)
    console.log(`[AUDIT] ${audit.timestamp} | ${audit.actorId} | ${audit.action} | Module: ${audit.module}`);
    console.log(`[DATA]`, data);

    const endTime = performance.now();
    
    return {
      data: data as T, // Mocking successful echo
      audit,
      latency: Math.round(endTime - startTime),
    };
  }

  /**
   * Performs a query (GET).
   */
  async query<T>(endpoint: string, module: string): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    await this.simulateNetworkLatency();
    const endTime = performance.now();

    return {
      latency: Math.round(endTime - startTime),
    };
  }
}

export const apiClient = new ApiClient();
