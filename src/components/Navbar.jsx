import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { token, logout } = useContext(AuthContext)

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <div className="flex space-x-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-800'}`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/blogs" 
          className={({ isActive }) => 
            `hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-800'}`
          }
        >
          Blogs
        </NavLink>
      </div>
      
      <div className="flex space-x-4">
        {!token ? (
          <>
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                `hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-800'}`
              }
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className={({ isActive }) => 
                `hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-800'}`
              }
            >
              Register
            </NavLink>
          </>
        ) : (
          <button 
            onClick={logout} 
            className="text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar