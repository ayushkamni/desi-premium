import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import DesiContent from './pages/DesiContent';
import PremiumLinks from './pages/PremiumLinks';

function App() {
  return (
    <div className="bg-cream text-dark min-h-screen font-body">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Desi Content Route */}
        <Route
          path="/desi-content"
          element={
            <ProtectedRoute>
              <DesiContent />
            </ProtectedRoute>
          }
        />

        {/* Premium Route */}
        <Route
          path="/premium"
          element={
            <ProtectedRoute>
              <PremiumLinks />
            </ProtectedRoute>
          }
        />

        {/* Placeholder Home Route for now */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
