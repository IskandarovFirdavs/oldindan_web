import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { api } from "../services/api";

export default function BranchesPage() {
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      setBranches(await api.getBranches());
    } catch {
      setError("Filiallarni olib bo'lmadi.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!branches) return <LoadingState />;

  return (
    <div className="page-stack">
      <PageHeader title="Filiallar" subtitle="Sizga ko'rinadigan branchlar ro'yxati" />
      <div className="cards-grid">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            title={branch.name}
            action={<span className={`pill ${branch.is_active ? "active" : "inactive"}`}>{branch.is_active ? "Faol" : "Nofaol"}</span>}
          >
            <div className="branch-item">
              <div className="muted-text">{branch.brand_name}</div>
              <div className="branch-address">{branch.address}</div>
              <div className="muted-text">{branch.phone || "Telefon yo'q"}</div>
              <Link className="secondary-button" to={`/branches/${branch.id}`}>Batafsil</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
