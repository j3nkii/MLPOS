import 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import { routerConfig } from './config/routerConfig';
import { queryClient } from '@query';
import './config/axiosConfig';


function App() {
  const router = createHashRouter(routerConfig);
  return (
    <div>
      <QueryClientProvider client={queryClient} >
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  )
}

export default App
