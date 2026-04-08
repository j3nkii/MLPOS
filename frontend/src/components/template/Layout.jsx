import 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ModalManager, Navbar } from '@components';
import { useAuthZussy } from '@zussy';



export const Layout = () => {
    const { user } = useAuthZussy();
    if (!user)
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
