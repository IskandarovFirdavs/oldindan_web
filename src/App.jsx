import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BranchesPage from "./pages/BranchesPage";
import BranchDetailPage from "./pages/BranchDetailPage";
import ZonesTablesPage from "./pages/ZonesTablesPage";
import BookingsPage from "./pages/BookingsPage";
import Layout from "./components/Layout";
import { AppContext } from "./context/AppContext";
import { getStoredAuth, saveStoredAuth, clearStoredAuth } from "./utils/storage";
import { api } from "./services/api";

export default function App() {
  const [auth, setAuth] = useState(getStoredAuth());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const boot = async () => {
      if (!auth?.token) {
        setReady(true);
        return;
      }
      try {
        api.setToken(auth.token);
        const user = await api.getProfile();
        const next = { token: auth.token, user };
        saveStoredAuth(next);
        setAuth(next);
      } catch {
        clearStoredAuth();
        api.setToken(null);
        setAuth(null);
      } finally {
        setReady(true);
      }
    };
    boot();
  }, []);

  const ctx = useMemo(() => ({
    auth,
    setAuth,
    logout() {
      clearStoredAuth();
      api.setToken(null);
      setAuth(null);
    }
  }), [auth]);

  if (!ready) return <div className="boot-screen">OLDINDAN yuklanmoqda...</div>;

  return (
    <AppContext.Provider value={ctx}>
      <Routes>
        <Route path="/login" element={auth ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={auth ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<DashboardPage />} />
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:branchId" element={<BranchDetailPage />} />
          <Route path="zones-tables" element={<ZonesTablesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={auth ? "/" : "/login"} replace />} />
      </Routes>
    </AppContext.Provider>
  );
}
