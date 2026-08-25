import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loggin, PageLoader } from '@components';
import { useUserQuery } from '@query';



export const AuthWrapper = () => {
    const { readUser } = useUserQuery();
    if (!readUser.data && !sessionStorage.getItem('accessToken'))
        return <Loggin />
    else return (
        <>
            <Outlet />
            <PageLoader />
        </>
    )
}
