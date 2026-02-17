import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  Dashboard,
  Setup,
  Transactions,
  Customers,
  Payouts,
} from './pages';
import { ConfigProvider, useConfig } from './config/ConfigContext';
import './App.css';

function AppRoutes() {
  const { isConfigured } = useConfig();
  console.debug('[AppRoutes] isConfigured:', isConfigured);

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

function App() {
  return (
    <ConfigProvider>
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;