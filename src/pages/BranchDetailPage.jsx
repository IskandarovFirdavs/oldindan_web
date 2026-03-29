import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { api } from "../services/api";

export default function BranchDetailPage() {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setBranch(await api.getBranch(branchId));
    } catch {
      setError("Filial detailni olib bo'lmadi.");
    }
  };

  useEffect(() => {
    load();
  }, [branchId]);

  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!branch) return <LoadingState />;

  return (
    <div className="page-stack">
      <PageHeader title={branch.name} subtitle={branch.address} />

      <div className="content-grid">
        <Card title="Asosiy ma'lumot">
          <div className="detail-list">
            <div className="detail-row"><span>Brand</span><strong>{branch.brand_name}</strong></div>
            <div className="detail-row"><span>Telefon</span><strong>{branch.phone || "—"}</strong></div>
            <div className="detail-row"><span>Status</span><strong>{branch.is_active ? "Faol" : "Nofaol"}</strong></div>
            <div className="detail-row"><span>Latitude</span><strong>{branch.latitude ?? "—"}</strong></div>
            <div className="detail-row"><span>Longitude</span><strong>{branch.longitude ?? "—"}</strong></div>
          </div>
        </Card>

        <Card title="Zonalar">
          <div className="zone-list">
            {(branch.zones || []).map((zone) => (
              <div key={zone.id} className="zone-row">
                <div>
                  <div className="zone-title">{zone.name}</div>
                  <div className="muted-text">{zone.description || "Tavsif yo'q"}</div>
                </div>
                <div className="zone-count">{(zone.tables || []).length} stol</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
