import { api, LoginRequest, LoginResponse, TokenManager } from './api';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = { email, password };
      const response = await api.post<LoginResponse>('/auth/login', loginData);
      
      // Store tokens and user data
      TokenManager.setToken(response.token);
      TokenManager.setRefreshToken(response.refreshToken);
      TokenManager.setUser(response);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Credenciales inválidas. Por favor verifica tu email y contraseña.');
    }
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      TokenManager.clearAll();
    }
  }

  /**
   * Validate current token
   */
  static async validateToken(): Promise<boolean> {
    try {
      const token = TokenManager.getToken();
      if (!token) return false;

      await api.get('/auth/validate');
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      TokenManager.clearAll();
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = TokenManager.getToken();
    const user = TokenManager.getUser();
    
    if (!token || !user) return false;
    
    // Check if token is expired
    if (TokenManager.isTokenExpired()) {
      TokenManager.clearAll();
      return false;
    }
    
    return true;
  }

  /**
   * Get current user data
   */
  static getCurrentUser(): LoginResponse | null {
    return TokenManager.getUser();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const user = TokenManager.getUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if user is admin
   */
  static isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  /**
   * Get user roles
   */
  static getUserRoles(): string[] {
    const user = TokenManager.getUser();
    return user?.roles || [];
  }
}

// Auth context types
export interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}
