import React from "react";
import styles from "./CardCalendar.module.scss";
import { useNavigate } from "react-router-dom";

interface CardCalendarProps {
  image: string;
  category: string;
  title: string;
  origin: string;
  releaseDate: string;
  ageRating: string;
  showtime: string[];
  time: number;
  typeMovie: string;
  id: number;
}

const CardCalendar: React.FC<CardCalendarProps> = ({
  image,
  category,
  title,
  origin,
  releaseDate,
  ageRating,
  showtime,
  time,
  typeMovie,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      onClick={() => {
        navigate(`/movieDetail/${id}`);
      }}
    >
      <div className={styles.cardImage}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.info}>
          <div className={styles.flex}>
            <div className={styles.category}>
              <span>{category}</span>
              <span>{time} phút</span>
            </div>
            <div className={styles.type}>{typeMovie}</div>
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.origin}>Xuất xứ: {origin}</div>
          <div className={styles.releaseDate}>Khởi chiếu: {releaseDate}</div>
          <div className={styles.rating}>{ageRating}</div>
        </div>
        <div>Lịch chiếu</div>
        <div className={styles.showTimeBox}>
          {showtime.map((t, i) => (
            <button key={i} className={styles.showtimeButton}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCalendar;
