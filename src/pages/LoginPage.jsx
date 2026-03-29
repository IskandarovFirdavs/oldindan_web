import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { saveStoredAuth } from "../utils/storage";
import { useAppContext } from "../context/AppContext";
import BrandLogo from "../components/BrandLogo";
import { API_BASE_URL } from "../config/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAppContext();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokenData = await api.login(form.username, form.password);
      api.setToken(tokenData.token);
      const user = await api.getProfile();
      const payload = { token: tokenData.token, user };
      saveStoredAuth(payload);
      setAuth(payload);
      navigate("/", { replace: true });
    } catch {
      setError("Login ishlamadi. Username/password yoki backend linkni tekshir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-panel">
        <BrandLogo />
        <div className="login-copy">
          <h1>OLDINDAN partner</h1>
          <p>Cafe va restaurant booking boshqaruvi uchun professional admin panel.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="admin"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
            />
          </label>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <div className="api-note">
          Active API: <code>{API_BASE_URL}</code>
        </div>
      </div>
    </div>
  );
}
