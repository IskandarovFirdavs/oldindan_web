const AUTH_KEY = "oldindan_partner_auth_clean";

export function saveStoredAuth(payload) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function getStoredAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY);
}
