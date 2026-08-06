import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export const useAuth = () => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const requireRole = (roles: string[]) => {
    if (!isAuthenticated) return false;
    return roles.includes(user?.role || '');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Auto logout on token expiry
  useEffect(() => {
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = tokenData.exp * 1000;
      const timeUntilExpiry = expiryTime - Date.now();

      if (timeUntilExpiry <= 0) {
        handleLogout();
      } else {
        const timer = setTimeout(handleLogout, timeUntilExpiry);
        return () => clearTimeout(timer);
      }
    }
  }, [token]);

  return {
    user,
    isAuthenticated,
    requireAuth,
    requireRole,
    logout: handleLogout,
  };
};