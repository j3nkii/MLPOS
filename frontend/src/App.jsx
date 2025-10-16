import React from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerConfig } from './config/routerConfig'

function App() {
    const router = createHashRouter(routerConfig);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
