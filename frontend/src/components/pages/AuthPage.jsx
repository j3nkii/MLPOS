import React, { useState, useEffect } from 'react';
import { Button, Input } from '@components';
import { useAuth } from '@useStateManager';
import { useNavigate } from "react-router";
import { Navigate } from 'react-router-dom';
import axios from 'axios'



export const AuthPage = () => {
    const navigate = useNavigate();
    const { setUser, pageView } = useAuth();
    const [tab, setTab] = useState(0);
    const tabs = [ <Loggin const={setTab} />, <ConfirmEmail /> ];

  useEffect(() => {
    isAuthenticated();
  }, []);
  
  const isAuthenticated = async () => {
    if(sessionStorage.getItem('accessToken')){
      try {
        const user = await axios.post('/api/auth/get-user', { accessToken: sessionStorage.getItem('accessToken') });
        setUser(user);
        navigate('/customers')
      } catch (error) {
        console.error(error);
      }
    }
  }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5d5d5d]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                { pageView === 'login' && <Loggin const={setTab} /> }
                { pageView === 'confirm' && <ConfirmEmail /> }
            </div>
        </div>
    );
}



const ConfirmEmail = () => {
    const { confirmationCodeForm: { code }, setConfirmationCode, postConfirmation } = useAuth();
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
                    value={code}
                    onChange={handleForm}
                />
                <Button children='Submit' />
            </form>
        </div>
    )
}



export const Loggin = ({ setTab }) => {
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
