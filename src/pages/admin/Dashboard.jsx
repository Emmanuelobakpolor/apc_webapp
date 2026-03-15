import React from 'react';
import { LayoutDashboard, Users, Home, Bell, Search } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      label: 'Total Users',
      value: '12,543',
      change: '+12% from last month',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Total Agents',
      value: '342',
      change: '+8% from last month',
      icon: Users,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Total Properties',
      value: '892',
      change: '+15% from last month',
      icon: Home,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Active Listings',
      value: '756',
      change: '+5% from last month',
      icon: Home,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Olamide', action: 'Listed a new property in Lekki', time: '2 hours ago' },
    { id: 2, user: 'Sarah Adebayo', action: 'Verified as an agent', time: '5 hours ago' },
    { id: 3, user: 'Michael Okonjo', action: 'Updated profile information', time: '1 day ago' },
    { id: 4, user: 'Tolani Williams', action: 'Contacted support', time: '2 days ago' },
    { id: 5, user: 'David Okafor', action: 'Listed a new property in Victoria Island', time: '3 days ago' }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      action: 'View Users'
    },
    {
      id: 2,
      title: 'Manage Agents',
      description: 'View and manage agent accounts',
      action: 'View Agents'
    },
    {
      id: 3,
      title: 'View Properties',
      description: 'Browse all listed properties',
      action: 'View Properties'
    },
    {
      id: 4,
      title: 'System Settings',
      description: 'Configure system preferences',
      action: 'Settings'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-[#002C3D]">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-[#002C3D] hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart placeholder - would display monthly performance metrics</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
