import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./FestivalDetails.module.scss";

const API_URL = "http://localhost:8080/festival";

type FestivalEvent = {
  id: number;
  name: string;
  image: string;
  description: string;
  created_at?: string;
//   date?: string; // nếu DB cũ có
};

const formatTimeVN = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", { hour12: false });
};

export default function FestivalDetails() {
  const { id } = useParams<{ id: string }>();
  const [festivalDetail, setFestivalDetail] = useState<FestivalEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: FestivalEvent) => setFestivalDetail(data))
      .catch(() => setFestivalDetail(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <h2 style={{ padding: 12 }}>Đang tải dữ liệu...</h2>;
  if (!festivalDetail) return <h2 style={{ padding: 12 }}>Không có dữ liệu</h2>;

  return (
    <div className={styles["festivalPage"]}>
      {/* (Tuỳ chọn) nút quay lại */}
      

      {/* TEXT CONTENT */}
      <div className={styles["contentWrapper"]}>
        <h2 className={styles["title"]}>{festivalDetail.name}</h2>

        {/* nếu bạn có style time thì dùng */}
        <p className={styles["time"]}>
          {formatTimeVN(festivalDetail.created_at || festivalDetail.date)}
        </p>

        {/* Mô tả từ DB */}
        <p className={styles["desc"]}>{festivalDetail.description}</p>
      </div>

      {/* BANNER IMAGE */}
      <div className={styles["banner"]}>
        <img
          src={festivalDetail.image}
          alt={festivalDetail.name}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* SCHEDULE IMAGE (nếu DB chưa có ảnh lịch, tạm dùng lại image) */}
      <div className={styles["scheduleImg"]}>
        <img
          src={festivalDetail.image}
          alt="Schedule"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <Link to="/festival" style={{ display: "inline-block", marginBottom: 12, textDecoration: 'none', border: '1px solid ', padding: '4px 8px', borderRadius: 4, color: '#000' }}>
        ← Quay lại
      </Link>
    </div>
  );
}
