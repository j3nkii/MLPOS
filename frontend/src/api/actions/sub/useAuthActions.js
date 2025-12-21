import 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@useState';
import { authService } from '@services';


export const useAuthctions = () => {
    const navigate = useNavigate();
    const { setUser, setLoading, setError, setPageView } = useAuth();

    const postConfirmation = async (body) => {
        try {
            setError(null);
            setLoading(true);
            const res = await authService.createConfirm(body);
            setUser(res.data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUser = async (body) => {
        try {
            setError(null);
            setLoading(true);
            const res = await authService.readAuth(body);
            setUser(res.data);
            sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
            sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken);
            sessionStorage.setItem('idToken', res.data.tokens.idToken);
            navigate('/customers');
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const createUser = async (body) => {
        try {
            setError(null);
            setLoading(true);
            await authService.createAuth(body);
            setPageView('confirm');
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        postConfirmation,
        fetchUser,
        createUser,
    }
}
