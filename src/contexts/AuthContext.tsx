import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '../mockdata/index';
import authService from '../services/auth.service';

export type UserRole = 'admin' | 'staff' | 'trainer' | 'member';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (FormLogin: { email: string; password: string }) => Promise<{ success: boolean; data?: any; error?: AuthError }>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Replace with actual API call
        const savedUser = localStorage.getItem('stagpower_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (FormLogin: { email: string; password: string }): Promise<{ success: boolean; data?: any; error?: any }> => {
    try {
      setIsLoading(true);

      // Import authService dynamically to avoid circular dependency
      const response = await authService.login(FormLogin);
      console.log('response', response);
      if (response && response.success) {
        const loggedInUser = response.data.user;
        // const loggedInUser: User = {
        //   id: userData.id,
        //   email: userData.email,
        //   fullName: userData.fullName || userData.email,
        //   phone: userData.phone,
        //   gender: userData.gender,
        //   dateOfBirth: userData.dateOfBirth,
        //   role: userData.role as UserRole,
        //   avatar: userData.avatar
        // };
        setUser(loggedInUser);

        // Lưu user data
        localStorage.setItem('stagpower_user', JSON.stringify(loggedInUser));

        // Lưu tokens
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        return { success: true, data: response };
      } else {
        return {
          success: false,
          error: {
            message: response?.message || 'Đăng nhập thất bại',
            code: response?.code || 'LOGIN_FAILED',
            details: response?.error
          }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
          code: 'UNKNOWN_ERROR',
          details: error
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<any> => {
    try {
      setIsLoading(true);

      // Call actual API
      const response = await authService.register({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: 'member', // Default role for new registrations
        gender: userData.gender || 'other',
        dateOfBirth: userData.dateOfBirth
      });

      if (response && response.success) {
        console.log('Registration successful:', response);
        return response;
      } else {
        return {
          success: false,
          error: {
            message: response?.message || 'Đăng ký thất bại',
            code: response?.code || 'REGISTER_FAILED',
            details: response?.error
          }
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
          code: 'UNKNOWN_ERROR',
          details: error
        }
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await authService.logout(refreshToken || '');
      console.log('Logout response:', response);
      if (response && response.success) {
        setUser(null);
        localStorage.removeItem('stagpower_user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole
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
