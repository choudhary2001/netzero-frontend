import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';

import SupplierDashboard from './components/supplier/Dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/auth/ForgotPassword';

import { AuthProvider } from './contexts/AuthContext';
import Profile from './components/profile/Profile';


import CompanyInfo from './components/supplier/CompanyInfoForm';
import Environment from './components/supplier/EnvironmentForm';
import Social from './components/supplier/SocialForm';
import Governance from './components/supplier/Governance';

import AdminDashboard from './components/admin/AdminDashboard';
import CompanyInfoManagement from './components/admin/CompanyInfoManagement';
import EnvironmentManagement from './components/admin/EnvironmentManagement';
import GovernanceManagement from './components/admin/GovernanceManagement';
import SocialManagement from './components/admin/SocialManagement';
import UserManagement from './components/admin/UserManagement';


const App = () => {
  const { token, user } = useSelector((state) => state.auth);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const RoleBasedRoute = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" />;
    return allowedRoles.includes(user?.role) ? children : <Navigate to="/" />;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            token ? <Navigate to="/" /> : <Login />
          } />

          {/* Admin Routes */}

          <Route path="/profile/" element={
            <RoleBasedRoute allowedRoles={['admin', 'supplier', 'guardian']}>
              <Layout>
                <Profile />
              </Layout>
            </RoleBasedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/user-management" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <UserManagement />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/company-info" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <CompanyInfoManagement />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/environment" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <EnvironmentManagement />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/governance" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <GovernanceManagement />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/social" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <SocialManagement />
              </Layout>
            </RoleBasedRoute>
          } />

          {/* supplier Routes */}
          <Route path="/supplier" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <SupplierDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/dashboard" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <SupplierDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/company-info" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <CompanyInfo />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/environment" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <Environment />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/social" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <Social />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/governance" element={
            <RoleBasedRoute allowedRoles={['supplier']}>
              <Layout>
                <Governance />
              </Layout>
            </RoleBasedRoute>
          } />


          {/* Forgot Password Route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Default Route */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                {user?.role === 'admin' && <Navigate to="/admin/dashboard" />}
                {user?.role === 'teacher' && <Navigate to="/teacher/dashboard" />}
                {user?.role === 'supplier' && <Navigate to="/supplier/dashboard" />}
                {user?.role === 'guardian' && <Navigate to="/guardian" />}
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App; 