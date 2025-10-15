// API Configuration and Base Service
const API_BASE_URL = 'http://localhost:5018/api';

// Types for API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  name: string;
  email: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  roles: string[];
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'proteia_token';
  private static readonly REFRESH_TOKEN_KEY = 'proteia_refresh_token';
  private static readonly USER_KEY = 'proteia_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getUser(): LoginResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setUser(user: LoginResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static clearAll(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isTokenExpired(): boolean {
    const user = this.getUser();
    if (!user) return true;
    
    const expiresAt = new Date(user.expiresAt);
    const now = new Date();
    return now >= expiresAt;
  }
}

// Base API class with interceptors
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add authorization header if token exists
    const token = TokenManager.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token && !TokenManager.isTokenExpired()) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - try to refresh token
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          const newHeaders = { ...headers };
          newHeaders.Authorization = `Bearer ${TokenManager.getToken()}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers: newHeaders,
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          TokenManager.clearAll();
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        TokenManager.setToken(data.token);
        TokenManager.setRefreshToken(data.refreshToken);
        TokenManager.setUser(data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API instance
export const api = new ApiService(API_BASE_URL);
export { TokenManager };
