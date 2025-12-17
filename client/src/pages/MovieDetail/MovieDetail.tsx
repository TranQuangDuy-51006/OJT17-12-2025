import { useEffect, useState } from 'react';

import styles from './MovieDetail.module.scss';
import {  useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/stores';
import { getAllMovie } from '../../store/slices/movieDetail';
import { getAllShowtime } from '../../store/slices/calendar';
import SeatSelection from '../../components/SeatSelection/SeatSelection';


export default function MovieDetail() {

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);


  const {id}  = useParams()
  const movieId = Number(id)

  const dispatch = useDispatch<AppDispatch>()
  const { movie, loading: movieLoading } = useSelector(
    (state: RootState) => state.movie

  )
  const { showtime, loading: showTimeLoading } = useSelector(
    (state: RootState) => state.calendar
  )
  useEffect(() => {
    dispatch(getAllMovie());
    dispatch(getAllShowtime())
  }, [dispatch]);

  // console.log("movie", movie[0]?.genre_name);
  const movieDetail = movie.find(m => m.id === movieId) || null;

  const showtimeMovie = showtime.filter((st) => st.movie_id === movieDetail?.id);


  const days = Array.from(
    new Set(showtimeMovie.map(st => st.day))
  );

  const hours = showtimeMovie
    .filter(st => st.day === selectedDay)
    .map(st => st.time);
  if (movieLoading || showTimeLoading) return <p>Loading...</p>;
  if (!movieDetail) return <p>Không có dữ liệu phim</p>;

  const selectedShowtime = showtimeMovie.find(
    st => st.day === selectedDay && st.time === selectedTime
  );




  return (
    <div>
      <div className={styles["movie-page"]}>

        {/* Banner */}
        <div className={styles.banner}>
          <img
            src={movieDetail.image}

            className={styles["banner-img"]}
          />
          <div className={styles["banner-overlay"]}> </div>

          {/* Desktop content */}
          <div className={`${styles["detail-container"]} ${styles.desktop}`}>
            <div className={styles.poster}>
              <img
                //`image`
                src={movieDetail.image}
                alt="Poster"
              />
            </div>

            <div className={styles["movie-info"]}>
              <div className={styles["title-row"]}>
                <h3 className={styles.title}>{movieDetail.title}</h3>
                <span className={styles.tag}>{movieDetail.type}</span>
              </div>

              <div className={styles.meta}>
                {/* <p>{`${movie[0].title}`}</p> */}

                <p>{movieDetail.duration} phút</p>
                <p>Đạo diễn: {movieDetail.author}</p>
              </div>
              <p>Khởi chiếu: {movieDetail.release_date}</p>

              <p className={styles.description}>
                {movieDetail.description}
              </p>

              <p className={styles.rating}>Kiểm duyệt: T16 - dành cho người từ 16+</p>

              <div className={styles.actions}>
                <button className={styles["detail-btn"]}>Chi tiết nội dung</button>
                <button className={styles["trailer-btn"]}>Xem trailer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile content */}
        <div className={`${styles["detail-container"]} ${styles.mobile}`}>
          <div className={styles.poster}>
            <img
              src={movieDetail.image}
              alt={movieDetail.title}
            />
            <span className={styles.tag}>{movieDetail.type}</span>
          </div>

          <div className={styles["movie-info"]}>
            <h3 className={styles.title}>
              {movieDetail.title}
            </h3>

            <div className={styles.meta}>
              <p>
                {movieDetail.genre_name} • {movieDetail.duration} phút
              </p>
            </div>

            <p className={styles.director}>
              Đạo diễn: {movieDetail.author}
            </p>

            <p className={styles.premiere}>
              Khởi chiếu: {movieDetail.release_date}
            </p>

            <p className={styles.description}>
              {movieDetail.description}
            </p>

            <p className={styles.rating}>
              Kiểm duyệt: T16 - dành cho người từ 16+
            </p>

            <div className={styles.actions}>
              <button className={styles["detail-btn"]}>
                Chi tiết nội dung
              </button>

              <a
                href={movieDetail.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className={styles["trailer-btn"]}
              >
                Xem trailer
              </a>
            </div>
          </div>
        </div>

        {/* Lịch chiếu */}
        <div className={styles.schedule} >
          <div className={styles["date-tabs"]}>
            {
              days.map(day => (
                <button className={`${styles.tab} ${selectedDay === day ? styles.tabActive : ""
                  }`} onClick={() => setSelectedDay(day)}>

                  <p className={styles.day}>  {day}</p>
                </button>
              ))
            }



          </div>
          {/* time */}
          <div className={styles["time-list"]}>
            {
              hours.map((t, i) => (
                <button
                  key={i}
                  className={styles["time-item"]}
                  onClick={() => setSelectedTime(t)}
                >
                  {t}
                </button>
              ))
            }

          </div>
        </div>
      </div>

      {/* ======================= SEAT SECTION ======================= */}
      {selectedTime && selectedShowtime && (
        <SeatSelection
          time={selectedTime}
          movie={movieDetail}
          day={selectedDay}
          showtimeId={selectedShowtime.id}
          onBack={() => setSelectedTime(null)}
        />
      )}






    </div>
  );
}