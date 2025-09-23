import React from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import { routerDefinition } from './utils/routerDefinition'

function App() {
    const router = createHashRouter(routerDefinition);
  return (
    <div className='bg-grey'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
