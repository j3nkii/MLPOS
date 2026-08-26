import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '@services';
import { useAuthZussy } from '@zussy';

export const useAuthQuery = () => {
    const authZussy = useAuthZussy();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const postConfirmation = useMutation({
        mutationFn: (body) => authService.createConfirm(body),
        onError: (error) => console.error(error),
    })

    const loggin = useMutation({
        mutationFn: (body) => authService.login(body),
        onSuccess: async (res) => {
            sessionStorage.setItem('accessToken', res.data.tokens.accessToken);
            // sessionStorage.setItem('refreshToken', res.data.tokens.refreshToken); <-- not in use.
            sessionStorage.setItem('idToken', res.data.tokens.idToken);
            await queryClient.fetchQuery({
                queryKey: ['user'],
                queryFn: userService.readUser,
                onSuccess: () => {
                    console.log('success');
                    navigate('/customers');
                },
                onError: (error) => console.error(error)
            });
        },
        onError: (error) => console.error(error),
    });

    const createUser = useMutation({
        mutationFn: (body) => authService.createAuth(body),
        onSuccess: () => navigate('/confirm-account'),
        onError: (error) => console.error(error),
    });

    const readUser = useQuery({
        queryKey: ['user'],
        queryFn: () => userService.readUser(),
        onError: (error) => console.error(error),
    })
    
    const logout = () => {
        console.log('LOGGOUT')
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.removeQueries({ queryKey: ['user'] });
        authZussy.logout();
        // navigate('/');
    }

    return {
        postConfirmation,
        loggin,
        createUser,
        logout,
        readUser,
    }
}
