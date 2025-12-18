import type { Payment } from "../types";

/* ===== THEO THÁNG (theo ngày) ===== */
export function revenueByMonth(payments: Payment[], month: number, year: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const map: Record<number, number> = {};

  payments.forEach((p) => {
    if (p.payment_status !== "COMPLETED" || !p.payment_time) return;
    const d = new Date(p.payment_time);

    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      map[day] = (map[day] || 0) + p.amount;
    }
  });

  return {
    labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
    data: Array.from({ length: daysInMonth }, (_, i) => map[i + 1] || 0),
  };
}

/* ===== THEO NĂM (12 tháng) ===== */
export function revenueByYear(payments: Payment[], year: number) {
  const data = Array(12).fill(0);

  payments.forEach((p) => {
    if (p.payment_status !== "COMPLETED" || !p.payment_time) return;
    const d = new Date(p.payment_time);

    if (d.getFullYear() === year) {
      data[d.getMonth()] += p.amount;
    }
  });

  return {
    labels: Array.from({ length: 12 }, (_, i) => `T${i + 1}`),
    data,
  };
}
