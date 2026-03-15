import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/Header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
