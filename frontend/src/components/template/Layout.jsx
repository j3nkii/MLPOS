import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ModalManager, Navbar } from '@components';
import { useUserQuery } from '@query';



export const Layout = () => {
    const { readUser } = useUserQuery();
    if (!readUser.data)
        return <Navigate to="/login" replace />
    else return (
        <div className='min-h-screen'>
            <Navbar />
            <div className='flex justify-center'>
                <Outlet />
            </div>
            <ModalManager />
        </div>
    );
}
