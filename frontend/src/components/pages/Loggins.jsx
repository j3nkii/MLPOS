import React, { useState } from 'react';
import { Button, Input } from '@components';
import { useStateManager } from '@useStateManager'
import { Navigate } from 'react-router-dom';

export const LogginsPage = () => {
    const { fetchUser, user, setLoginForm, loginForm } = useStateManager();
    const handlForm = (evt) => {
        const { target: { name, value }} = evt;
        setLoginForm({ name, value });
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        fetchUser();
    }
    if (user)
        return <Navigate to="/customers" replace />
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Username"
                            name="username"
                            placeholder="Enter your username"
                            value={loginForm.username}
                            onChange={handlForm}
                        />
                        {/* <Input
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                        /> */}
                    <Button children='Login' />
                </form>
            </div>
        </div>
    );
};
