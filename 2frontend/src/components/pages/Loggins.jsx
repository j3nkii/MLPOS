import React from 'react';
import { Button, Input } from '@components';
import { useStore } from '@store'
import { Navigate } from 'react-router-dom';

export const LogginsPage = () => {
    const { fetchUser, user } = useStore();
    const handleSubmit = (evt) => {
        evt.preventDefault();
        fetchUser()
    }
    if (user) return <Navigate to="/" replace />
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Username"
                            name="username"
                            placeholder="Enter your username"
                        />
                        <Input
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    <Button text='Login' />
                </form>
            </div>
        </div>
    );
};
