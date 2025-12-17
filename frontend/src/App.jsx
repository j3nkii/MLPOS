import 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from './config/routerConfig';
import './config/axiosConfig';



function App() {
  const router = createHashRouter(routerConfig);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
