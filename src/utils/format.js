export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
}

export function bookingStatusLabel(status) {
  const map = {
    pending: "Kutilmoqda",
    confirmed: "Tasdiqlangan",
    checked_in: "Keldi",
    completed: "Yakunlandi",
    canceled: "Bekor qilindi",
    no_show: "Kelmagan"
  };
  return map[status] || status;
}
