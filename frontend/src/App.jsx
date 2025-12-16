import React, { useEffect } from 'react'
import axios from 'axios'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from './config/routerConfig';
import './config/axiosConfig';








function App() {
  const router = createHashRouter(routerConfig);

  useEffect(() => {
    isAuthenticated();
  }, []);
  
  const isAuthenticated = async () => {
    if(sessionStorage.getItem('accessToken')){
      try {
        await axios.post('/api/auth/get-user', { accessToken: sessionStorage.getItem('accessToken') });
      } catch (error) {
        console.error('Error handling auth');
      }
    }
  }
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
