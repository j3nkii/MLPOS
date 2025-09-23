import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@store'


export const AuthRoute = () => {
    const { user } = useStore()
    if (!user)
        return <Navigate to="/login" replace />;
    else return <Outlet />;
}