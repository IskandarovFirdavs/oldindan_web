import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { api } from "../services/api";

export default function ZonesTablesPage() {
  const [branches, setBranches] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [zones, setZones] = useState(null);
  const [tables, setTables] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [zoneForm, setZoneForm] = useState({ name: "", description: "" });
  const [tableForm, setTableForm] = useState({ zone: "", name: "", capacity: 2 });

  const loadBranches = async () => {
    const items = await api.getBranches();
    setBranches(items);
    if (!selectedBranch && items[0]) setSelectedBranch(String(items[0].id));
  };

  const loadData = async (branchId) => {
    const [zonesData, tablesData] = await Promise.all([api.getZones(branchId), api.getTables(branchId)]);
    setZones(zonesData);
    setTables(tablesData);
  };

  const load = async () => {
    setError("");
    try {
      await loadBranches();
    } catch {
      setError("Branchlar yuklanmadi.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;
    loadData(selectedBranch).catch(() => setError("Zona va stol ma'lumotlari yuklanmadi."));
  }, [selectedBranch]);

  const zoneOptions = useMemo(() => zones || [], [zones]);

  const createZone = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.createZone({
        branch: Number(selectedBranch),
        name: zoneForm.name,
        description: zoneForm.description
      });
      setZoneForm({ name: "", description: "" });
      setMessage("Zona yaratildi.");
      await loadData(selectedBranch);
    } catch {
      setMessage("Zona yaratilmadi. Staff permissionni tekshir.");
    }
  };

  const createTable = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.createTable({
        zone: Number(tableForm.zone),
        name: tableForm.name,
        capacity: Number(tableForm.capacity)
      });
      setTableForm({ zone: "", name: "", capacity: 2 });
      setMessage("Stol yaratildi.");
      await loadData(selectedBranch);
    } catch {
      setMessage("Stol yaratilmadi. Zone va staff permissionni tekshir.");
    }
  };

  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!branches || !zones || !tables) return <LoadingState />;

  return (
    <div className="page-stack">
      <PageHeader
        title="Zonalar va stollar"
        subtitle="Branch ichidagi joylashuvni boshqarish"
        right={
          <select className="select-box" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        }
      />

      {message ? <div className="notice-box">{message}</div> : null}

      <div className="content-grid">
        <Card title="Zona yaratish">
          <form className="form-grid" onSubmit={createZone}>
            <label>
              Zona nomi
              <input value={zoneForm.name} onChange={(e) => setZoneForm((p) => ({ ...p, name: e.target.value }))} placeholder="Indoor" />
            </label>
            <label>
              Tavsif
              <textarea value={zoneForm.description} onChange={(e) => setZoneForm((p) => ({ ...p, description: e.target.value }))} placeholder="Ichki zal" />
            </label>
            <button className="primary-button">Zona qo'shish</button>
          </form>
        </Card>

        <Card title="Stol yaratish">
          <form className="form-grid" onSubmit={createTable}>
            <label>
              Zona
              <select value={tableForm.zone} onChange={(e) => setTableForm((p) => ({ ...p, zone: e.target.value }))}>
                <option value="">Tanlang</option>
                {zoneOptions.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
              </select>
            </label>
            <label>
              Stol nomi
              <input value={tableForm.name} onChange={(e) => setTableForm((p) => ({ ...p, name: e.target.value }))} placeholder="T1" />
            </label>
            <label>
              Capacity
              <input type="number" min="1" value={tableForm.capacity} onChange={(e) => setTableForm((p) => ({ ...p, capacity: e.target.value }))} />
            </label>
            <button className="primary-button">Stol qo'shish</button>
          </form>
        </Card>
      </div>

      <div className="content-grid">
        <Card title="Zonalar ro'yxati">
          <div className="zone-list">
            {zones.map((zone) => (
              <div key={zone.id} className="zone-row">
                <div>
                  <div className="zone-title">{zone.name}</div>
                  <div className="muted-text">{zone.description || "Tavsif yo'q"}</div>
                </div>
                <div className="zone-count">
                  {tables.filter((table) => String(table.zone) === String(zone.id)).length} stol
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Stollar ro'yxati">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Stol</th><th>Capacity</th><th>Zona ID</th><th>Status</th></tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id}>
                    <td>{table.name}</td>
                    <td>{table.capacity}</td>
                    <td>{table.zone}</td>
                    <td>{table.is_active ? "Faol" : "Nofaol"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
