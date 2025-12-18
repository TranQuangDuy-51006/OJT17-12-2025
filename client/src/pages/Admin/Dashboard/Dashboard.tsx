import { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import RevenueChart from "../../../components/RevenueChart/RevenueChart";
import { revenueByMonth, revenueByYear } from "../../../utils/revenueChart";
import type { Movie, Payment } from "../../../types";

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [festivals, setFestivals] = useState([]);

  /* ===== THỜI GIAN HIỆN TẠI (CỐ ĐỊNH) ===== */
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  /* ===== STATE CHO BIỂU ĐỒ ===== */
  const [mode, setMode] = useState<"month" | "year">("month");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    fetch("http://localhost:8080/movies")
      .then((res) => res.json())
      .then(setMovies);

    fetch("http://localhost:8080/payments")
      .then((res) => res.json())
      .then(setPayments);

    fetch("http://localhost:8080/festival")
      .then((res) => res.json())
      .then(setFestivals);
  }, []);

  /* ===== DOANH THU THÁNG HIỆN TẠI (CARD) ===== */
  const totalAmountThisMonth = payments.reduce((sum, p) => {
    if (p.payment_status !== "COMPLETED" || !p.payment_time) return sum;

    const d = new Date(p.payment_time);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear ? sum + p.amount : sum;
  }, 0);

  /* ===== DATA BIỂU ĐỒ ===== */
  const chartData = mode === "month" ? revenueByMonth(payments, month, year) : revenueByYear(payments, year);

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        <h2>📊 Tổng quan hệ thống</h2>
        <p>Thống kê nhanh về hoạt động của hệ thống quản lý rạp phim.</p>
      </div>

      {/* ===== CARDS ===== */}
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.blue}`}>
          <p>Tổng số phim</p>
          <h3>{movies.length}</h3>
        </div>

        <div className={`${styles.card} ${styles.green}`}>
          <p>Tổng lượt đặt vé</p>
          <h3>{payments.length}</h3>
        </div>

        <div className={`${styles.card} ${styles.purple}`}>
          <p>Doanh thu tháng này</p>
          <h3>{totalAmountThisMonth.toLocaleString("vi-VN")} đ</h3>
        </div>

        <div className={`${styles.card} ${styles.yellow}`}>
          <p>Sự kiện đang diễn ra</p>
          <h3>{festivals.length}</h3>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <div className={styles.chart}>
        <h3>📈 Biểu đồ doanh thu</h3>

        {/* FILTER (NHẸ – KHÔNG PHÁ UI) */}
        <div className={styles.chartFilter}>
          <select value={mode} onChange={(e) => setMode(e.target.value as "month" | "year")}>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>

          {mode === "month" && (
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          )}

          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <RevenueChart labels={chartData.labels} data={chartData.data} />
      </div>
    </div>
  );
}
