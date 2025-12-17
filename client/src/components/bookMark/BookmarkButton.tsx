import React, { useEffect, useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

const API_BOOKMARKS = "http://localhost:8080/bookmarks";

type BookmarkRow = {
  id: string | number;
  user_id: number;
  movie_id: number;
  created_at: string;
};

// lấy user_id hiện tại (bạn đổi theo auth của bạn)
const getCurrentUserId = () => {
  const raw = localStorage.getItem("user_id");
  const n = raw ? Number(raw) : 1; // mặc định user=1 nếu chưa có login
  return Number.isFinite(n) && n > 0 ? n : 1;
};

export default function BookmarkButton({
  movieId,
  className,
  size = 20,
}: {
  movieId: number;
  className?: string;
  size?: number;
}) {
  const userId = useMemo(() => getCurrentUserId(), []);
  const [loading, setLoading] = useState(false);
  const [bookmark, setBookmark] = useState<BookmarkRow | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch(`${API_BOOKMARKS}?user_id=${userId}&movie_id=${movieId}`)
      .then((r) => r.json())
      .then((arr: BookmarkRow[]) => {
        if (!mounted) return;
        setBookmark(Array.isArray(arr) && arr.length > 0 ? arr[0] : null);
      })
      .catch(() => {
        // không cần toast khi load lỗi
      });

    return () => {
      mounted = false;
    };
  }, [userId, movieId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);

    try {
      if (bookmark) {
        const res = await fetch(`${API_BOOKMARKS}/${bookmark.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("DELETE failed");
        setBookmark(null);
        toast.success("Đã bỏ đánh dấu");
      } else {
        const payload = {
          user_id: userId,
          movie_id: movieId,
          created_at: new Date().toISOString(),
        };

        const res = await fetch(API_BOOKMARKS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("POST failed");

        const created: BookmarkRow = await res.json();
        setBookmark(created);
        toast.success("Đã đánh dấu phim");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const active = !!bookmark;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={active ? "Bỏ đánh dấu" : "Đánh dấu"}
      title={active ? "Bỏ đánh dấu" : "Đánh dấu"}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        width: 36,
        height: 36,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Bookmark
        size={size}
        style={{
          color: active ? "#fbbf24" : "#e5e7eb",
          fill: active ? "#fbbf24" : "transparent",
        }}
      />
    </button>
  );
}
