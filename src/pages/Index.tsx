import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import DealersPage from './DealersPage';
import FarmersPage from './FarmersPage';
import DistributorsPage from './DistributorsPage';
import SettingsPage from './SettingsPage';
import SettingsTemplatePage from './SettingsTemplatePage';
import NotFound from './NotFound';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  const guard = (el: JSX.Element) => (authenticated ? el : <Navigate to="/" replace />);

  return (
    <Routes>
      <Route
        path="/"
        element={authenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={login} />}
      />
      <Route path="/register" element={<RegisterPage onRegistered={login} />} />
      <Route path="/dashboard" element={guard(<Dashboard onLogout={logout} />)} />
      <Route path="/dealers" element={guard(<DealersPage onLogout={logout} />)} />
      <Route path="/farmers" element={guard(<FarmersPage onLogout={logout} />)} />
      <Route path="/distributors" element={guard(<DistributorsPage onLogout={logout} />)} />
      <Route path="/settings" element={guard(<Navigate to="/settings/dealer" replace />)} />
      <Route path="/settings/dealer" element={guard(<SettingsTemplatePage type="dealer" onLogout={logout} />)} />
      <Route path="/settings/farmer" element={guard(<SettingsTemplatePage type="farmer" onLogout={logout} />)} />
      <Route path="/settings/distributor" element={guard(<SettingsTemplatePage type="distributor" onLogout={logout} />)} />
      <Route path="/settings/legacy" element={guard(<SettingsPage onLogout={logout} />)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;

