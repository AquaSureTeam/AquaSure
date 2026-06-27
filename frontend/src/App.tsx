import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { HistoricalDataPage } from './pages/HistoricalDataPage';
import { AlertsPage } from './pages/AlertsPage';
import { DevicesPage } from './pages/DevicesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/live" element={<LiveMonitoringPage />} />
            <Route path="/history" element={<HistoricalDataPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/devices" element={<DevicesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
