import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateManager } from '@useStateManager'

export const Layout = () => {
    const { user } = useStateManager()
    if (!user)
        return <Navigate to="/login" replace />;
    else return (
        <div className='bg-grey-500'>
            <div className='m-12'>
                <Outlet />
            </div>
        </div>
        
    );
};