import React, { useEffect, useState } from "react";
import { Newspaper, Plus, Pencil, Trash2, Calendar } from "lucide-react";

const API_URL = "http://localhost:8080/news";

interface NewsItem {
  id?: number;
  title: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [formData, setFormData] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteItem, setDeleteItem] = useState<NewsItem | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchNews = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openAdd = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      title: "",
      image: "",
      created_at: today,
      updated_at: today,
    });
    setShowForm(true);
  };

  const openEdit = (item: NewsItem) => {
    setFormData({ ...item });
    setShowForm(true);
  };

  const saveNews = async () => {
    if (!formData) return;
    const today = new Date().toISOString().slice(0, 10);

    if (formData.id) {
      await fetch(`${API_URL}/${formData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          image: formData.image,
          updated_at: today,
        }),
      });
      showToastMessage("Sửa tin tức thành công!");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      showToastMessage("Thêm tin tức thành công!");
    }

    setShowForm(false);
    setFormData(null);
    fetchNews();
  };

  const confirmDelete = async () => {
    if (!deleteItem?.id) return;

    await fetch(`${API_URL}/${deleteItem.id}`, {
      method: "DELETE",
    });

    setDeleteItem(null);
    fetchNews();
    showToastMessage("Xoá tin tức thành công!");
  };

  const filtered = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex gap-2">
          <Newspaper className="text-blue-600" />
          Quản lý tin tức
        </h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Thêm tin
        </button>
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Tìm theo tiêu đề..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {paginated.map((n) => (
          <div key={n.id} className="border p-4 rounded space-y-2">
            <h3 className="font-semibold">{n.title}</h3>

            <p className="text-sm text-gray-500 flex gap-1">
              <Calendar size={14} /> {n.created_at}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => openEdit(n)}
                className="bg-yellow-100 px-3 py-1 rounded"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleteItem(n)}
                className="bg-red-100 px-3 py-1 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showForm && formData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded w-[420px] space-y-4">
            <h3 className="font-bold text-lg">
              {formData.id ? "Sửa tin tức" : "Thêm tin tức"}
            </h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Tiêu đề"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Link ảnh"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)}>Hủy</button>
              <button
                onClick={saveNews}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded w-[360px] space-y-4">
            <h3 className="font-bold text-red-600 text-lg">
              Xác nhận xoá
            </h3>
            <p>
              Bạn có chắc muốn xoá tin: <b>{deleteItem.title}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteItem(null)}>Hủy</button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}