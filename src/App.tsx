import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import {
  Dashboard,
  Setup,
  Transactions,
  Customers,
  Payouts,
} from './pages';
import { isHorusPayConfigured, getHorusPayConfig, configureHorusPay } from './config/horuspay';
import './App.css';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore configuration from localStorage
    const config = getHorusPayConfig();
    if (config.apiKey && config.accountId) {
      configureHorusPay(config);
      setIsConfigured(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🎯 Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/transactions"
            element={isConfigured ? <Transactions /> : <Navigate to="/setup" />}
          />
          <Route
            path="/customers"
            element={isConfigured ? <Customers /> : <Navigate to="/setup" />}
          />
          <Route
            path="/payouts"
            element={isConfigured ? <Payouts /> : <Navigate to="/setup" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
