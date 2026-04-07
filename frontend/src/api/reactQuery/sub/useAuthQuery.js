import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthZussy } from '@zussy';
import { authService } from '@services';

export const useAuthQuery = () => {
    const navigate = useNavigate();
    const { setPageView, loginForm } = useAuthZussy();

    const postConfirmation = useMutation({
        mutationFn: (body) => authService.createConfirm(body),
        onError: (error) => console.error(error),
    })

    const fetchUser = useMutation({
        mutationFn: () => authService.readAuth(loginForm),
        onSuccess: (res) => {
            sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
            // sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken); <-- not in use.
            sessionStorage.setItem('idToken', res.data.tokens.idToken);
            navigate('/customers');
        },
        onError: (error) => console.error(error),
    })

    const createUser = useMutation({
        mutationFn: (body) => authService.createAuth(body),
        onSuccess: () => setPageView('confirm'),
        onError: (error) => console.error(error),
    })

    return {
        postConfirmation,
        fetchUser,
        createUser,
    }
}
