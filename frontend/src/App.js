import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ShopsPage from './pages/ShopsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import DashboardPage from './pages/DashboardPage';
import ListItemPage from './pages/ListItemPage';
import ProfilePage from './pages/ProfilePage';

// Styles
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/shops" element={<ShopsPage />} />

              {/* Protected - all logged in users */}
              <Route path="/profile" element={
                <PrivateRoute><ProfilePage /></PrivateRoute>
              } />
              <Route path="/my-bookings" element={
                <PrivateRoute><MyBookingsPage /></PrivateRoute>
              } />

              {/* Protected - owners only */}
              <Route path="/dashboard" element={
                <PrivateRoute roles={['shop_owner', 'individual_owner', 'admin']}>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/list-item" element={
                <PrivateRoute roles={['shop_owner', 'individual_owner', 'admin']}>
                  <ListItemPage />
                </PrivateRoute>
              } />
              <Route path="/edit-item/:id" element={
                <PrivateRoute roles={['shop_owner', 'individual_owner', 'admin']}>
                  <ListItemPage />
                </PrivateRoute>
              } />
              <Route path="/my-listings" element={
                <PrivateRoute roles={['shop_owner', 'individual_owner', 'admin']}>
                  <DashboardPage />
                </PrivateRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
