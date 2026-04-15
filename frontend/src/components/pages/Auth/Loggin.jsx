import { useState } from 'react';
import { Button, Input } from '@components';
import { useAuthQuery, useUserQuery } from '@query';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router';

// export const AuthPage = () => {
//     const navigate = useNavigate();
//     const { setUser, pageView } = useAuthZussy();

//   useEffect(() => {
//     isAuthenticated();
//   }, []);
  
//   const isAuthenticated = async () => {
//     if(sessionStorage.getItem('accessToken')){
//       try {
//         const user = await axios.post('/api/auth/get-user', { accessToken: sessionStorage.getItem('accessToken') });
//         setUser(user);
//         navigate('/customers');
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
//     return (
//         <div className='min-h-screen flex items-center justify-center bg-[#5d5d5d]'>
//             <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
//                 { pageView === 'login' && <Loggin /> }
//                 { pageView === 'confirm' && <ConfirmEmail /> }
//             </div>
//         </div>
//     );
// }



export const Loggin = () => {
    const { readUser } = useUserQuery();
    const { loggin } = useAuthQuery();
    const [logginForm, setLogginForm] = useState({
        email: '',
        password: '',
    })
    const handleForm = (evt) => {
        const { target: { name, value }} = evt;
        setLogginForm({ ...logginForm, [name]: value });
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        loggin.mutate(logginForm);
    }
    
    if (readUser.data)
        return <Navigate to='/customers' replace />
    return (
        <div className='min-h-screen flex items-center justify-center bg-black'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
                <div>
                    <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>Welcome Back</h1>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                            <Input
                                label='Email'
                                name='email'
                                placeholder='Enter your email'
                                value={logginForm.email}
                                onChange={handleForm}
                            />
                            <Input
                                label='Password'
                                name='password'
                                placeholder='Enter your password'
                                value={logginForm.password}
                                onChange={handleForm}
                            />
                        <Button color={'green'} type='submit' children='Login' />
                    </form>
                </div>
            </div>
        </div>
    );
};
