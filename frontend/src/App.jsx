import 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from './config/routerConfig'
import './config/axiosConfig'


const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    }
});


function App() {
  const router = createHashRouter(routerConfig);
  return (
    <div>
      <QueryClientProvider client={client} >
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  )
}

export default App
