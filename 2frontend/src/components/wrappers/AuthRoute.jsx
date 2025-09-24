import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateManager } from '@useStateManager'


export const AuthRoute = () => {
    const { user } = useStateManager()
    if (!user)
        return <Navigate to="/login" replace />;
    else return <Outlet />;
}