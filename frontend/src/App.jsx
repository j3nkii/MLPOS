import React, { useEffect } from 'react'
import axios from 'axios'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from './config/routerConfig';
import './config/axiosConfig';

// import { useAuth } from '@useStateManager'








function App() {
  const router = createHashRouter(routerConfig);
  // const { setUser } = useAuth();

  // useEffect(() => {
  //   isAuthenticated();
  // }, []);
  
  // const isAuthenticated = async () => {
  //   if(sessionStorage.getItem('accessToken')){
  //     try {
  //       const { user } = await axios.post('/api/auth/get-user', { accessToken: sessionStorage.getItem('accessToken') });
  //       setUser(user);
  //     } catch (error) {
  //       console.error('Error handling auth');
  //     }
  //   }
  // }
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
