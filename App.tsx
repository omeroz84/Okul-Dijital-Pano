import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set default hash if empty
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Simple Routing based on Hash
  if (currentPath === '#/admin') {
    return <AdminPanel />;
  }

  // Default to Dashboard
  return <Dashboard />;
};

export default App;