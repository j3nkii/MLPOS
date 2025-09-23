import React from 'react';
import { Button, Input } from '@components';

export const LogginsPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                <form className="space-y-4">
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
