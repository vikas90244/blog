import React from 'react';
import {Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider}
  from 'react-router-dom'
import Register from './components/Register';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import Login from './components/Login';
const App = () => {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path="register" element={<Register />} />
    </Route>
  ))
  return (
   <div>
    <RouterProvider router={router}/> 
    
   </div>
  )
}

export default App