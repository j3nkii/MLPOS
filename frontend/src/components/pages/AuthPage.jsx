import React, { useState } from 'react';
import { Button, Input } from '@components';
import { useAuth } from '@useStateManager'
import { Navigate } from 'react-router-dom';



export const AuthPage = () => {
    const [tab, setTab] = useState(0);
    const tabs = [ <Loggin /> ];
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5d5d5d]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                { tabs[tab] }
            </div>
        </div>
    );
}



export const Loggin = () => {
    const { fetchUser, user, setLoginForm, loginForm, createUser } = useAuth();
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
        <div>
            {/* <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"> */}
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginForm.email}
                            onChange={handlForm}
                        />
                        <Input
                            label="Password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    <Button children='Login' />
                    <Button type='button' onClick={createUser} children='Sign Up' />
                </form>
                {/* <Button children='Forgot Password' onClick={} /> */}
            {/* </div> */}
        </div>
    );
};
