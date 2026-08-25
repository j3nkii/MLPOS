import 'react';
import { Outlet } from 'react-router-dom';
import { ModalManager, Navbar, ToastManager } from '@components';



export const Layout = () => (
    <div className='min-h-screen'>
        <Navbar />
        <div className='flex justify-center'>
            <Outlet />
        </div>
        <ModalManager />
        <ToastManager />
    </div>
);
