
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Payment.module.scss";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import emailjs from "emailjs-com";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "vnpay" | "viettel" | "payoo">("vietqr");
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  const [showOTP, setShowOTP] = useState(false);
  const [serverOtp, setServerOtp] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");


  const [sendingOTP, setSendingOTP] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("http://localhost:8080/users/4");

      setUser(res.data);
    };

    fetchUser();
  }, []);


  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { movie, day, time, seats, total } = state;
  const totalSeat = seats.length

  const sendOTPEmail = async (otp: string) => {
    setSendingOTP(true);

    try {
      if (!user) throw new Error("User not loaded");

      await emailjs.send(
        "service_h7me6oh",
        "template_y7owq5k",
        {
          otp,
          to_name: `${user.first_name} ${user.last_name}`,
          to_email: user.email,
        },
        "57nZWcg4L0Se2UhUy"
      );

    } catch (err) {
      console.error("Send OTP failed", err);
      throw err;
    } finally {
      setSendingOTP(false);
    }
  };


  const handleVerifyOtp = async () => {
    setOtpError("");

    // VALIDATE
    if (!otp.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setOtpError("OTP phải gồm 6 chữ số");
      return;
    }

    if (String(serverOtp) !== otp) {
      setOtpError("OTP không đúng, vui lòng kiểm tra lại");
      return;
    }

    //  OTP ĐÚNG → LƯU DB
    try {
      // 1️⃣ BOOKING
      const bookingRes = await axios.post("http://localhost:8080/bookings", {
        user_id: user.id,
        showtime_id: state.showtimeId,
        total_seat: seats.length,
        total_price_movie: total,
        created_at: new Date().toISOString()
      });

      const bookingId = bookingRes.data.id;

      // 2️ BOOKING SEAT
      for (const seat of seats) {
        await axios.post("http://localhost:8080/booking_seat", {
          booking_id: bookingId,
          showtime_id: state.showtimeId,
          seat_number: seat,
          created_at: new Date().toISOString()
        });
      }

      // 3️ PAYMENT
      await axios.post("http://localhost:8080/payments", {
        booking_id: bookingId,
        payment_method: paymentMethod.toUpperCase(),
        payment_status: "COMPLETED",
        payment_time: new Date().toISOString(),
        amount: total,
        transaction_id: "TXN_" + Date.now()
      });

      setShowOTP(false);
      navigate("/payment-success");
    } catch (e) {
      console.error(e);
      setOtpError("Lỗi khi lưu thanh toán");
    }
  };


  return (
    <div>
      <div className={styles.paymentContainer}>
        <div className={styles.leftSide}>
          <div className={styles.box}>
            <h4 className={styles.boxTitle}>Thông tin phim</h4>
            <div className={styles.rowItem}>
              <p>Phim</p>
              <p className={styles.bold}>{movie.title}</p>
            </div>
            <div className={styles.row2col}>
              <div className={styles.colItem}>
                <p>Ngày giờ chiếu</p>
                <p>
                  <span className={styles.time}>{time}</span> -{" "}
                  <span className={styles.bold}>{day}</span>
                </p>
              </div>
              <div className={styles.colItem}>
                <p>Ghế</p>
                <p className={styles.bold}>{seats.join(", ")}</p>
              </div>
            </div>
            <div className={styles.row2col}>
              <div className={styles.colItem}>
                <p>Định dạng</p>
                <p className={styles.bold}>2D</p>
              </div>
              <div className={styles.colItem}>
                <p>Phòng chiếu</p>
                <p className={styles.bold}>7</p>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <h4 className={styles.boxTitle}>Thông tin thanh toán</h4>
            <table className={styles.billTable}>
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ghế {seats.join(", ")}</td>
                  <td>{totalSeat}</td>
                  <td>  {total.toLocaleString("vi-VN")}đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.box}>
            <h4 className={styles.boxTitle}>Phương thức thanh toán</h4>
            <div className={styles.payMethods}>
              <label
                className={`${styles.method} ${paymentMethod === "vietqr" ? styles.active : ""
                  }`}
                onClick={() => setPaymentMethod("vietqr")}
              >
                <span className={styles.circle}>
                  {paymentMethod === "vietqr" && (
                    <Check size={14} color="white" strokeWidth={3} />
                  )}
                </span>

                <span className={styles.methodLabel}>
                  <img
                    src="https://res.cloudinary.com/dfzpwkldb/image/upload/v1765460017/vietqr_fzncnu.svg"
                    alt="VietQR"
                    className={styles.methodIcon}
                  />
                  VietQR
                </span>
              </label>



              <label
                className={`${styles.method} ${paymentMethod === "vnpay" ? styles.active : ""
                  }`}
                onClick={() => setPaymentMethod("vnpay")}
              >
                <span className={styles.circle}>
                  {paymentMethod === "vnpay" && (
                    <Check size={14} color="white" strokeWidth={3} />
                  )}
                </span>

                <span className={styles.methodLabel}>
                  <img
                    src="https://res.cloudinary.com/dfzpwkldb/image/upload/v1765459826/vnpay2_ywohnt.svg"
                    alt="VNPAY"
                    className={styles.methodIcon}
                  />
                  VNPAY
                </span>
              </label>



              <label
                className={`${styles.method} ${paymentMethod === "viettel" ? styles.active : ""
                  }`}
                onClick={() => setPaymentMethod("viettel")}
              >
                <span className={styles.circle}>
                  {paymentMethod === "viettel" && (
                    <Check size={14} color="white" strokeWidth={3} />
                  )}
                </span>

                <span className={styles.methodLabel}>
                  <img
                    src="https://res.cloudinary.com/dfzpwkldb/image/upload/v1765459994/viettel1_sf5lch.svg"
                    alt="Viettel Money"
                    className={styles.methodIcon}
                  />
                  Viettel Money
                </span>
              </label>



              <label
                className={`${styles.method} ${paymentMethod === "payoo" ? styles.active : ""
                  }`}
                onClick={() => setPaymentMethod("payoo")}
              >
                <span className={styles.circle}>
                  {paymentMethod === "payoo" && (
                    <Check size={14} color="white" strokeWidth={3} />
                  )}
                </span>

                <span className={styles.methodLabel}>
                  <img
                    src="https://res.cloudinary.com/dfzpwkldb/image/upload/v1765460250/payoo_1_pvsgxl.svg"
                    alt="Payoo"
                    className={styles.methodIcon}
                  />
                  Payoo
                </span>
              </label>



            </div>

            {/* COST */}
            <h4 className={styles.boxTitle}>Chi phí</h4>

            <div className={styles.costRow}>
              <p>Thanh toán</p>
              <p className={styles.bold}>{total.toLocaleString("vi-VN")}đ</p>
            </div>

            <div className={styles.costRow}>
              <p>Phí</p>
              <p className={styles.bold}>0đ</p>
            </div>

            <div className={styles.costRow}>
              <p>Tổng cộng</p>
              <p className={styles.bold}>{total.toLocaleString("vi-VN")}đ</p>
            </div>

            <button
              className={styles.payBtn}
              disabled={sendingOTP}
              onClick={async () => {
                try {
                  if (!user) {
                    alert("Chưa load được user");
                    return;
                  }

                  const otp = Math.floor(100000 + Math.random() * 900000);
                  setServerOtp(otp);
                  setOtp("");
                  setOtpError("");

                  await sendOTPEmail(String(otp));
                  setShowOTP(true);
                } catch {
                  alert("Không gửi được OTP");
                }
              }}
            >
              {sendingOTP ? "Đang gửi OTP..." : "Thanh toán"}
            </button>


            <button
              className={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>

            <div className={styles.LuuY}>
              Lưu ý: Không mua vé cho trẻ em dưới 13 tuổi đối với các suất
              chiếu phim kết thúc sau 22h00 và không mua vé cho trẻ em dưới 16
              tuổi đối với các suất chiếu phim kết thúc sau 23h00.
            </div>
          </div>
        </div>
        {showOTP && (
          <div
            onClick={() => setShowOTP(false)}
            className={styles.otpOverlay}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.otpBox}
            >
              <h3>Xác thực OTP</h3>

              <p className={styles.otpDesc}>
                Mã OTP đã được gửi đến email của bạn
              </p>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••••"
                className={`${styles.otpInput} ${otpError ? styles.errorInput : ""}`}
              />

              {otpError && <p className={styles.error}>{otpError}</p>}

              <button
                className={styles.payBtn}
                onClick={handleVerifyOtp}
              >
                Xác nhận
              </button>

              <button
                className={styles.backBtn}
                onClick={() => setShowOTP(false)}
              >
                Huỷ
              </button>
            </div>
          </div>
        )}


      </div>
    </div>

  );
}
