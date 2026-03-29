import { bookingStatusLabel } from "../utils/format";
export default function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{bookingStatusLabel(status)}</span>;
}
