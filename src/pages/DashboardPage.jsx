import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import { api } from "../services/api";
import { formatDateTime } from "../utils/format";

export default function DashboardPage() {
  const [branches, setBranches] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [branchesData, bookingsData] = await Promise.all([api.getBranches(), api.getBookings()]);
      setBranches(branchesData);
      setBookings(bookingsData);
    } catch {
      setError("Dashboard ma'lumotlarini olib bo'lmadi.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    if (!branches || !bookings) return null;
    const today = new Date().toISOString().slice(0, 10);
    return {
      branches: branches.length,
      all: bookings.length,
      today: bookings.filter((b) => String(b.booking_time || "").startsWith(today)).length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length
    };
  }, [branches, bookings]);

  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!summary || !bookings) return <LoadingState />;

  return (
    <div className="page-stack">
      <PageHeader title="Dashboard" subtitle="Bugungi booking oqimi va branch holati" />

      <div className="stats-grid">
        <StatCard label="Filiallar" value={summary.branches} hint="Jami ko'rinayotgan branchlar" />
        <StatCard label="Bookinglar" value={summary.all} hint="Jami bookinglar" />
        <StatCard label="Bugungi booking" value={summary.today} hint="Bugungi sana bo'yicha" />
        <StatCard label="Confirmed" value={summary.confirmed} hint="Tasdiqlangan bookinglar" />
      </div>

      <Card title="Oxirgi bookinglar">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Mijoz</th>
                <th>Filial</th>
                <th>Stol</th>
                <th>Vaqt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map((item) => (
                <tr key={item.id}>
                  <td>{item.user_username}</td>
                  <td>{item.branch_name}</td>
                  <td>{item.table_name}</td>
                  <td>{formatDateTime(item.booking_time)}</td>
                  <td><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
