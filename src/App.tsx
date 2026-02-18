import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard, Setup, Transactions, Customers, Payouts } from './pages';
import { AuthPage } from './pages/AuthPage';
import { WebhooksPage } from './pages/WebhooksPage';
import { ConfigProvider, useConfig } from './config/ConfigContext';
import './App.css';

function AppRoutes() {
  const { isConfigured } = useConfig();

  const Protected = ({ el }: { el: React.ReactElement }) =>
    isConfigured ? el : <Navigate to="/setup" />;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/setup"        element={<Setup />} />
          <Route path="/transactions" element={<Protected el={<Transactions />} />} />
          <Route path="/customers"    element={<Protected el={<Customers />} />} />
          <Route path="/payouts"      element={<Protected el={<Payouts />} />} />
          <Route path="/auth"         element={<Protected el={<AuthPage />} />} />
          <Route path="/webhooks"     element={<Protected el={<WebhooksPage />} />} />
          <Route path="*"             element={<Navigate to="/" />} />
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
