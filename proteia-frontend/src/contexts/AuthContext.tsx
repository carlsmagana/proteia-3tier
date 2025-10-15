import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthContextType } from '../services/authService';
import { LoginResponse } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser) {
            // Validate token with server
            const isValid = await AuthService.validateToken();
            if (isValid) {
              setUser(currentUser);
            } else {
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const userData = await AuthService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    return AuthService.hasRole(role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && AuthService.isAuthenticated(),
    isLoading,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <div>No tienes permisos para acceder a esta sección</div>,
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Requerido</h2>
          <p>Debes iniciar sesión para acceder a esta aplicación.</p>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
