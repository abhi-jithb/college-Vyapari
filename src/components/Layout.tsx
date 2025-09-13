import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      <main className="pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;