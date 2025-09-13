import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-blue-400 bg-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`
          }
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        <NavLink
          to="/post-hustle"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-blue-400 bg-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`
          }
        >
          <PlusCircle size={20} />
          <span className="text-xs mt-1">Post</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-blue-400 bg-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`
          }
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-gray-800"
        >
          <LogOut size={20} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;