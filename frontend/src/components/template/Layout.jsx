import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ModalManager, Navbar, PageLoader, ToastManager } from '@components';
import { useUserQuery } from '@query';



export const Layout = () => {
    const { readUser } = useUserQuery();
    if (!readUser.data && !sessionStorage.getItem('accessToken'))
        return <Navigate to='/login' replace />
    else return (
        <div className='min-h-screen'>
            <Navbar />
            <div className='flex justify-center'>
                <Outlet />
            </div>
            <ModalManager />
            <ToastManager />
            <PageLoader />
        </div>
    );
}
