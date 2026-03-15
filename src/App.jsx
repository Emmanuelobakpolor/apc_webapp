import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Shared
import RoleSelection from './pages/RoleSelection';
import LoginSelection from './pages/LoginSelection';

// Agent
import AgentSignup from './pages/agent/Signup';
import AgentLogin from './pages/agent/Login';
import AgentDashboard from './pages/agent/Dashboard';
import AgentProperties from './pages/agent/Properties';
import AgentInquiries from './pages/agent/Inquiries';
import AgentSettings from './pages/agent/Settings';
import AgentLayout from './layouts/AgentLayout';

// Owner
import OwnerSignup from './pages/owner/Signup';
import OwnerLogin from './pages/owner/Login';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerProperties from './pages/owner/Properties';
import OwnerUsers from './pages/owner/Users';
import OwnerAgents from './pages/owner/Agents';
import OwnerAccount from './pages/owner/Account';
import OwnerInquiries from './pages/owner/Inquiries';
import OwnerLayout from './layouts/OwnerLayout';

// Admin
import AdminLogin      from './pages/admin/Login';
import AdminDashboard  from './pages/admin/Dashboard';
import AdminUsers      from './pages/admin/Users';
import AdminAgents     from './pages/admin/Agents';
import AdminProperties from './pages/admin/Properties';
import AdminAccount    from './pages/admin/Account';
import AdminLayout     from './layouts/AdminLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<LoginSelection />} />

      {/* Agent */}
      <Route path="/agent/signup" element={<AgentSignup />} />
      <Route path="/agent/login" element={<AgentLogin />} />
      <Route element={<AgentLayout />}>
        <Route path="/agent/dashboard"   element={<AgentDashboard />}   />
        <Route path="/agent/properties"  element={<AgentProperties />}  />
        <Route path="/agent/inquiries"   element={<AgentInquiries />}   />
        <Route path="/agent/settings"    element={<AgentSettings />}    />
      </Route>

      {/* Owner */}
      <Route path="/owner/signup" element={<OwnerSignup />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route element={<OwnerLayout />}>
        <Route path="/owner/dashboard"   element={<OwnerDashboard />}   />
        <Route path="/owner/properties"  element={<OwnerProperties />}  />
        <Route path="/owner/users"       element={<OwnerUsers />}       />
        <Route path="/owner/agents"      element={<OwnerAgents />}      />
        <Route path="/owner/inquiries"   element={<OwnerInquiries />}   />
        <Route path="/owner/account"     element={<OwnerAccount />}     />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard"   element={<AdminDashboard />}   />
        <Route path="/admin/users"       element={<AdminUsers />}       />
        <Route path="/admin/agents"      element={<AdminAgents />}      />
        <Route path="/admin/properties"  element={<AdminProperties />}  />
        <Route path="/admin/account"     element={<AdminAccount />}     />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
