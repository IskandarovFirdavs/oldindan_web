import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
import { formatDateTime } from "../utils/format";

const FILTERS = ["all", "pending", "confirmed", "checked_in", "completed", "canceled", "no_show"];

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setError("");
    try {
      setBookings(await api.getBookings());
    } catch {
      setError("Bookinglarni olib bo'lmadi.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    if (filter === "all") return bookings;
    return bookings.filter((item) => item.status === filter);
  }, [bookings, filter]);

  const updateStatus = async (id, status) => {
    setMessage("");
    try {
      await api.updateBooking(id, { status });
      setMessage("Booking status yangilandi.");
      await load();
    } catch {
      setMessage("Status o'zgarmadi. Staff permissionni tekshir.");
    }
  };

  const cancelBooking = async (id) => {
    setMessage("");
    try {
      await api.cancelBooking(id);
      setMessage("Booking bekor qilindi.");
      await load();
    } catch {
      setMessage("Booking bekor bo'lmadi.");
    }
  };

  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!bookings) return <LoadingState />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Bookinglar"
        subtitle="Keluvchi mijozlar va booking nazorati"
        right={
          <select className="select-box" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {FILTERS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        }
      />

      {message ? <div className="notice-box">{message}</div> : null}

      <Card title="Booking ro'yxati">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mijoz</th>
                <th>Filial</th>
                <th>Stol</th>
                <th>Vaqt</th>
                <th>Mehmon</th>
                <th>Status</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.user_username}</td>
                  <td>{item.branch_name}</td>
                  <td>{item.table_name}</td>
                  <td>{formatDateTime(item.booking_time)}</td>
                  <td>{item.num_guests}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="action-group">
                      <button className="secondary-button small" onClick={() => updateStatus(item.id, "confirmed")}>Confirm</button>
                      <button className="secondary-button small" onClick={() => updateStatus(item.id, "checked_in")}>Check-in</button>
                      <button className="danger-button small" onClick={() => cancelBooking(item.id)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
