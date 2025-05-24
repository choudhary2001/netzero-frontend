import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SupplierDashboard from './components/supplier/Dashboard';
import LandingPage from './components/landing/LandingPage';
import AboutUs from './components/landing/AboutUs';
import ContactUs from './components/landing/ContactUs';
import PrivacyPolicy from './components/landing/PrivacyPolicy';
import Terms from './components/landing/Terms';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/auth/ForgotPassword';

import { AuthProvider } from './contexts/AuthContext';
import Profile from './components/profile/Profile';
import ScrollToTop from './components/ScrollToTop';

import CompanyInfo from './components/supplier/CompanyInfoForm';
import Environment from './components/supplier/EnvironmentForm';
import Social from './components/supplier/SocialForm';
import Quality from './components/supplier/Quality';
import Governance from './components/supplier/GovernanceForm';
import HelpSupport from './components/supplier/HelpSupport';
import AccountSettings from './components/supplier/AccountSettings';
import KPIDashboard from './components/supplier/KPIDashboard';
import Messages from './components/supplier/SupplierChat';
import AdminDashboard from './components/admin/AdminDashboard';
import CompanyInfoManagement from './components/admin/CompanyInfoManagement';
import EnvironmentManagement from './components/admin/EnvironmentManagement';
import GovernanceManagement from './components/admin/GovernanceManagement';
import SocialManagement from './components/admin/SocialManagement';
import UserManagement from './components/admin/UserManagement';
import ChatPage from './components/admin/AdminChat';
import ContactManagement from './components/admin/ContactManagement';

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
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="/login" element={
            token ? <Navigate to="/dashboard" /> : <Login />
          } />

          {/* Admin Routes */}

          <Route path="/profile/" element={
            <RoleBasedRoute allowedRoles={['admin', 'supplier', 'company']}>
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
          <Route path="/admin/chat" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <ChatPage />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/admin/contact-management" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <ContactManagement />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/admin/chat/:companyId" element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <Layout>
                <ChatPage />
              </Layout>
            </RoleBasedRoute>
          } />

          {/* supplier Routes */}
          <Route path="/supplier" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <SupplierDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/dashboard" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <SupplierDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/company/dashboard" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <SupplierDashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/company-info" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <CompanyInfo />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/environment" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <Environment />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/social" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <Social />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/quality" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <Quality />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/governance" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <Governance />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/carbon-emission" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <KPIDashboard />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/supplier/help-support" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <HelpSupport />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/account-settings" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <AccountSettings />
              </Layout>
            </RoleBasedRoute>
          } />
          <Route path="/supplier/chat" element={
            <RoleBasedRoute allowedRoles={['supplier', 'company']}>
              <Layout>
                <Messages />
              </Layout>
            </RoleBasedRoute>
          } />

          {/* Forgot Password Route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                {user?.role === 'admin' && <Navigate to="/admin/dashboard" />}
                {user?.role === 'company' && <Navigate to="/company/dashboard" />}
                {user?.role === 'supplier' && <Navigate to="/supplier/dashboard" />}
              </Layout>
            </PrivateRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <LandingPage />
            )
          } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App; 