import http, { setAuthToken } from "./http";

export const api = {
  setToken(token) {
    setAuthToken(token);
  },

  async login(username, password) {
    const { data } = await http.post("/auth/login/", { username, password });
    return data;
  },

  async getProfile() {
    const { data } = await http.get("/users/me/");
    return data;
  },

  async getBranches() {
    const { data } = await http.get("/restaurants/branches/");
    return Array.isArray(data) ? data : data.results || [];
  },

  async getBranch(id) {
    const { data } = await http.get(`/restaurants/branches/${id}/`);
    return data;
  },

  async getZones(branchId) {
    const { data } = await http.get("/restaurants/zones/", {
      params: { "branch__id": branchId }
    });
    return Array.isArray(data) ? data : data.results || [];
  },

  async createZone(payload) {
    const { data } = await http.post("/restaurants/zones/", payload);
    return data;
  },

  async getTables(branchId) {
    const { data } = await http.get("/restaurants/tables/", {
      params: { "zone__branch__id": branchId }
    });
    return Array.isArray(data) ? data : data.results || [];
  },

  async createTable(payload) {
    const { data } = await http.post("/restaurants/tables/", payload);
    return data;
  },

  async getBookings() {
    const { data } = await http.get("/bookings/");
    return Array.isArray(data) ? data : data.results || [];
  },

  async updateBooking(id, payload) {
    const { data } = await http.patch(`/bookings/${id}/`, payload);
    return data;
  },

  async cancelBooking(id) {
    const { data } = await http.post(`/bookings/${id}/cancel/`);
    return data;
  }
};
