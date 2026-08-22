import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem('user');

    if (token.startsWith('mock_')) {
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const savedRole = localStorage.getItem('user_role') || parsed.role || (parsed.username === 'admin' ? 'admin' : parsed.username?.includes('hr') ? 'hr' : 'employee');
          setUser({ ...parsed, role: savedRole });
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      const userData = response.data?.data || response.data;
      if (userData) {
        const savedRole = localStorage.getItem('user_role');
        const role = userData?.role || savedRole || (userData?.is_superuser || userData?.username === 'admin' ? 'admin' : userData?.is_staff || userData?.username?.includes('hr') ? 'hr' : 'employee');
        const enrichedUser = { ...userData, role };
        setUser(enrichedUser);
        localStorage.setItem('user', JSON.stringify(enrichedUser));
        localStorage.setItem('user_role', role);
      }
    } catch (error) {
      console.log('Session fallback to isolated state:', error?.message || error);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          const savedRole = localStorage.getItem('user_role') || parsed.role || (parsed.username === 'admin' ? 'admin' : parsed.username?.includes('hr') ? 'hr' : 'employee');
          const enriched = { ...parsed, role: savedRole };
          setUser(enriched);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('user_role');
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, access, refresh) => {
    if (access) localStorage.setItem('accessToken', access);
    if (refresh) localStorage.setItem('refreshToken', refresh);
    const savedRole = localStorage.getItem('user_role');
    const role = userData?.role || savedRole || (userData?.is_superuser || userData?.username === 'admin' ? 'admin' : userData?.is_staff || userData?.username?.includes('hr') ? 'hr' : 'employee');
    const enrichedUser = { ...userData, role, avatar: userData?.avatar || '' };
    localStorage.setItem('user', JSON.stringify(enrichedUser));
    localStorage.setItem('user_role', role);
    setUser(enrichedUser);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('userAvatar');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);