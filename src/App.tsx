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
import { getHorusPayConfig, configureHorusPay } from './config/horuspay';
import './App.css';

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = getHorusPayConfig();
    if (config.apiKey && config.accountId) {
      configureHorusPay(config);
      setIsConfigured(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span className="loading-text">Chargement...</span>
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