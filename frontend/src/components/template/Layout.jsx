import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@useState'
import { ModalManager, Navbar } from '@components'

export const Layout = () => {
    const { user } = useAuth();
    console.log(user)
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