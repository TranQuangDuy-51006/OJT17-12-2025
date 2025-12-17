import React from "react";
import { useParams } from "react-router-dom";
import styles from "./InforPage.module.scss";

// 👉 Tốt nhất bạn import từ file newsData.ts
const newsData = [
    { date: "03/10/2024", title: "Chương trình phim kỷ niệm nhân dịp 70 năm Giải phóng Thủ đô", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361165/70Nam_msoufb.png" },
    { date: "13/09/2024", title: "VUI TẾT TRUNG THU - RINH QUÀ VI VU", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361168/TrungThu_vozvqn.png" },
    { date: "09/09/2024", title: 'Chương trình "Suất chiếu đặc biệt" lần đầu tiên diễn ra tại Trung tâm Chiếu phim Quốc gia', img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361166/SuatChieu_msfqfu.png" },
    { date: "04/09/2024", title: "SUẤT CHIẾU ĐẶC BIỆT - QUÀ TẶNG TƯNG BỪNG - GIÁ VÉ KHÔNG ĐỔI", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361167/QuaTang_meuio7.png" },
    { date: "21/08/2024", title: "Đợt phim kỷ niệm 79 năm Cách Mạng Tháng Tám và Quốc Khánh", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361167/79Nam_rsvgqo.png" },
    { date: "04/08/2024", title: "Tuyển dụng cộng tác viên soát vé tại Trung tâm Chiếu phim Quốc gia", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361167/TuyenDung_zltjdb.png" },
    { date: "16/07/2024", title: "THÔNG BÁO HOÀN THÀNH KHẢO SÁT CƠ SỞ VẬT CHẤT NĂM 2024", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361166/ThongBao_f0fpbx.png" },
    { date: "12/07/2024", title: "REVIEW PHIM HOẠT HÌNH HOT NHẤT - KẺ TRỘM MẶT TRĂNG 4", img: "https://res.cloudinary.com/dqsuasgcy/image/upload/v1765361166/Milion_todbnm.png" }
];

const InforPage: React.FC = () => {
    const { id } = useParams();        
    const news = newsData[Number(id)];

    if (!news) return <h2>Bài viết không tồn tại</h2>;

    return (
        <div className={styles["infor-page"]}>
            <div className={styles["info-content"]}>

                <h1>{news.title}</h1>
                <p><strong>Ngày đăng:</strong> {news.date}</p>

                <p>
                    Nhân dịp 70 năm ngày Giải phóng Thủ đô (10/10/1954 – 10/10/2024), Trung tâm Chiếu phim Quốc gia tổ chức chương trình phim kỉ niệm tại Trung tâm.

                    Bộ phim được chọn để trình chiếu miễn phí là: “Đào, phở và Piano”… 
                </p>

                <div className={styles["info-image"]}>
                    <img src="https://res.cloudinary.com/dqsuasgcy/image/upload/v1765435305/IMG_cxxjcy.svg" alt={news.title} />
                </div>

            </div>
        </div>
    );
};

export default InforPage;
