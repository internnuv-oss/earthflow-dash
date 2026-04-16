import { useState } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

const Index = () => {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />;
};

export default Index;
