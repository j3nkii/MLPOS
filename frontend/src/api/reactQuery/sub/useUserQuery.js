import { useQuery } from '@tanstack/react-query';
import { userService } from '@services';

export const useUserQuery = () => {

    const readUser = useQuery({
        queryKey: ['user'],
        queryFn: () => userService.readUser(),
        onError: (error) => console.error(error),
    })

    return {
        readUser,
    }
}
