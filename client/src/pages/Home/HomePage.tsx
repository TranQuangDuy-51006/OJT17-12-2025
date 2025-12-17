import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

import "swiper/swiper-bundle.css";
import axiosClient from "../../apis/axiosClient";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../components/bookMark/BookmarkButton";
import CalendarDN from "../../components/CalendarDN/CalendarDN";
// import axiosClient from "@/api/axiosClient";

/* ======================================================
   TYPE (GIỮ ĐÚNG SHAPE UI HIỆN TẠI)
====================================================== */
type Movie = {
  id: number;
  title: string;
  rating: number;
  poster: string;
  genre?: string;
  release_date: string;
};

/* ======================================================
   PROMOS + EVENTS (GIỮ NGUYÊN)
====================================================== */
const promos = [
  {
    id: 1,
    title: "Đồng giá 25K trước 12h",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Combo bắp nước siêu hời",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  },
];

const events = [
  {
    id: 1,
    title: "Suất chiếu sớm cuối tuần",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Q&A cùng đạo diễn",
    image: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=800&h=600&fit=crop",
  },
];

/* ======================================================
   HERO
====================================================== */
const Hero: React.FC = () => (
  <section className="pt-7">
    <div className="relative mx-4 lg:mx-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      <div className="relative h-[260px] md:h-[340px] lg:h-[500px]">
        <img
          src="https://res.cloudinary.com/diprwc5iy/image/upload/v1765361311/banner_ebzzbo.jpg"
          alt="Movie banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>
    </div>
  </section>
);

/* ======================================================
   SECTION TITLE
====================================================== */
const SectionHeading: React.FC<{ title: string; color?: string }> = ({ title, color = "#e5e5e5" }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl md:text-2xl font-bold" style={{ color }}>
      {title}
    </h2>
  </div>
);

/* ======================================================
   MOVIE CARD
====================================================== */
const MovieCard: React.FC<{
  movie: Movie;
  size?: "lg" | "md" | "sm";
  showGenreBadge?: boolean;
}> = ({ movie, size = "md", showGenreBadge }) => {
  const sizeClass = size === "lg" ? "w-full h-[300px]" : size === "sm" ? "w-full h-[225px]" : "w-full h-[280px]";

  const navigate = useNavigate();
  return (
    <div className="group relative overflow-hidden rounded-xl bg-[#1a1a1a] border border-white/5 shadow-lg shadow-black/40 transition hover:-translate-y-1 hover:shadow-[#dc2626]/20">
      <div className={`relative ${sizeClass}`}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-20">
          <BookmarkButton
            movieId={movie.id}
            className="bg-black/35 hover:bg-black/55 border border-white/15 backdrop-blur-sm"
          />
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-black/60 flex items-center justify-center">
          <button
            className="px-4 py-2 bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition"
            onClick={() => navigate(`/movieDetail/${movie.id}`)}
          >
            Đặt vé
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
            <Star className="w-4 h-4 fill-yellow-400" />
            {movie.rating.toFixed(1)}
            {showGenreBadge && movie.genre && (
              <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-white/10 text-white">{movie.genre}</span>
            )}
          </div>
          <p className="mt-1 font-semibold text-white line-clamp-1">{movie.title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-300">
            {movie.genre && <span>{movie.genre}</span>}
            <span>•</span>
            <span>{new Date(movie.release_date).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   SIDEBAR DESKTOP 
====================================================== */
const Sidebar: React.FC<{ topHot: Movie[] }> = ({ topHot }) => (
  <aside className="w-[300px] shrink-0 sticky top-24 space-y-6">
    {/* PROMOS */}
    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 space-y-3">
      <h3 className="text-lg font-semibold text-white">Khuyến mãi</h3>
      <div className="space-y-3">
        {promos.map((promo) => (
          <img key={promo.id} src={promo.image} className="rounded-lg" />
        ))}
      </div>
    </div>

    {/* EVENTS */}
    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 space-y-3">
      <h3 className="text-lg font-semibold text-white">Sự kiện</h3>
      <div className="space-y-3">
        {events.map((ev) => (
          <img key={ev.id} src={ev.image} className="rounded-lg" />
        ))}
      </div>
    </div>

    {/* TOP HOT */}
    <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Top phim hot</h3>
      <div className="space-y-3">
        {topHot.map((movie) => (
          <div key={movie.id} className="flex items-center gap-3">
            <img src={movie.poster} className="w-14 h-14 rounded-md" />
            <div>
              <p className="text-sm text-white font-semibold">{movie.title}</p>
              <div className="text-xs text-yellow-400">⭐ {movie.rating.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

/* ======================================================
   MOVIE GRID 
====================================================== */
const MovieGrid: React.FC<{
  title: string;
  movies: Movie[];
  colorTitle?: string;
}> = ({ title, movies, colorTitle }) => (
  <section className="space-y-4">
    {" "}
    <SectionHeading title={title} color={colorTitle} />{" "}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {" "}
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}{" "}
    </div>{" "}
  </section>
);

/* ======================================================
   HOMEPAGE – FETCH DB.JSON
====================================================== */
export default function HomePage() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const [movieRes, genreRes] = await Promise.all([axiosClient.get("/movies"), axiosClient.get("/genres")]);

      const movies = movieRes.data;
      const genres = genreRes.data;

      const genreMap = new Map<number, string>();
      genres.forEach((g: any) => genreMap.set(g.id, g.genre_name));

      const mapped: Movie[] = movies.map((m: any) => ({
        id: m.id,
        title: m.title,
        poster: m.image,
        genre: genreMap.get(m.genre_id),
        release_date: m.release_date,
        rating: +(Math.random() * (10 - 8) + 8).toFixed(1),
      }));

      const today = new Date();

      setNowPlaying(mapped.filter((m) => new Date(m.release_date) <= today));
      setComingSoon(mapped.filter((m) => new Date(m.release_date) > today));
    };

    fetchMovies();
  }, []);

  const topHot = nowPlaying.slice(0, 3);

  return (
    <div className="bg-[#0a0a0a] text-[#e5e5e5] min-h-screen">
      <Hero />

      <div className="container mx-auto px-4 lg:px-6 xl:px-8 mt-12 flex gap-8">
        <div className="flex-1 space-y-12">
          <MovieGrid title="🔴 PHIM ĐANG CHIẾU" movies={nowPlaying} colorTitle="#f97316" />
          <MovieGrid title="⏳ PHIM SẮP CHIẾU" movies={comingSoon} colorTitle="#60a5fa" />
        </div>

        <div className="hidden xl:block">
          <Sidebar topHot={topHot} />
        </div>
      </div>
    </div>
  );
}
