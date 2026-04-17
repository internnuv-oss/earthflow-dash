import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import FarmersPage from './FarmersPage';
import DistributorsPage from './DistributorsPage';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <Routes>
      <Route
        path="/"
        element={authenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={login} />}
      />
      <Route path="/register" element={<RegisterPage onRegistered={login} />} />
      <Route
        path="/dashboard"
        element={authenticated ? <Dashboard onLogout={logout} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/farmers"
        element={authenticated ? <FarmersPage onLogout={logout} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/distributors"
        element={authenticated ? <DistributorsPage onLogout={logout} /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default Index;
