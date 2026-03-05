import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound';
import Success from './pages/Success/Success';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/success' element={<Success />} />
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Admin route placeholder - will build next */}
          <Route 
            path='/admin' 
            element={
              <ProtectedRoute requireAdmin={true}>
                <div style={{ padding: "100px", textAlign: "center" }}>
                  <h1>Admin Dashboard</h1>
                  <p>Coming in next phase...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
};

export default App;