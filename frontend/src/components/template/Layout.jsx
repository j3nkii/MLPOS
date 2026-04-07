import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthZussy } from '@zussy'
import { ModalManager, Navbar } from '@components'

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