import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import authService from '../services/authService';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                const isValid = await authService.checkAuthStatus();
                if (!isValid) {
                    dispatch(logout());
                    navigate('/login');
                }
            }
        };

        checkAuth();
    }, [token, dispatch, navigate]);

    return { isAuthenticated: !!token, user };
}; 