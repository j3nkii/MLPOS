import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateManager } from '@useStateManager'
import { ModalManager } from '@components'

export const Layout = () => {
    const { user } = useStateManager()
    if (!user)
        return <Navigate to="/login" replace />;
    else return (
        <div className='min-h-screen bg-gray-400'>
            <div>
                <ModalManager />
                <Outlet />
            </div>
        </div>
        
    );
};