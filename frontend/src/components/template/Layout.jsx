import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@useStateManager'
import { ModalManager, Navbar } from '@components'

export const Layout = () => {
    const { user } = useAuth();
    if (!user)
        return <Navigate to="/login" replace />
    else return (
        <div className='min-h-screen'>
            <Navbar />
            <ModalManager />
            <div className='flex justify-center'>
                <Outlet />
            </div>
        </div>
        
    );
}