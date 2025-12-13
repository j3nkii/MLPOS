import React, { useState } from 'react';
import { Button, Input } from '@components';
import { useAuth } from '@useStateManager'
import { Navigate } from 'react-router-dom';



export const AuthPage = () => {
    const [tab, setTab] = useState(1);
    const tabs = [ <Loggin />, <ConfirmEmail /> ];
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5d5d5d]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                { tabs[tab] }
            </div>
        </div>
    );
}



const ConfirmEmail = () => {
    const { confirmationCode, setConfirmationCode, postConfirmation } = useAuth();
    const handleForm = (evt) => {
        const { target: { value }} = evt;
        setConfirmationCode(value);
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        postConfirmation();
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Check email for confirmation code.</h1>
            <form onSubmit={handleSubmit} className="space-y-4 pb-8">
                <Input
                    label="Code"
                    name="code"
                    value={confirmationCode}
                    onChange={handleForm}
                />
                <Button children='Submit' />
            </form>
        </div>
    )
}



export const Loggin = () => {
    const { fetchUser, user, setLoginForm, loginForm, createUser } = useAuth();
    const handleForm = (evt) => {
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
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={handleForm}
                    />
                    <Input
                        label="Password"
                        name="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={handleForm}
                    />
                <Button children='Login' />
                <Button type='button' onClick={createUser} children='Sign Up' />
            </form>
            {/* <div>
                <a>Sign up</a>
                <a>Forgot Email</a>
            </div> */}
        </div>
    );
};
