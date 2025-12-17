import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../../apis/axiosClient";

type Props = {
  open: boolean;
  user: any;
  onClose: () => void;
  onUpdateSuccess: (user: any) => void;
};

export default function ProfileUpdateModal({
  open,
  user,
  onClose,
  onUpdateSuccess,
}: Props) {
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =======================
        LOCK SCROLL
  ======================== */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* =======================
        SYNC USER
  ======================== */
  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarPreview(
        user.avatar ||
          "https://i.pinimg.com/736x/c3/91/3d/c3913dc52d35241596ade71e69d29ab0.jpg"
      );
      setShowChangePassword(false);
    }
  }, [user, open]);

  if (!open) return null;

  /* =======================
        HANDLERS
  ======================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
  if (loading) return;

  try {
    setLoading(true);

    // ===== VALIDATE PASSWORD =====
    let newPasswordToUpdate: string | undefined;

    if (showChangePassword) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu");
        return;
      }

      if (formData.currentPassword !== user.password) {
        toast.error("Mật khẩu hiện tại không đúng");
        return;
      }

      if (formData.newPassword.length < 8) {
        toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Xác nhận mật khẩu không khớp");
        return;
      }

      newPasswordToUpdate = formData.newPassword;
    }

    // ===== UPDATE USER =====
    const res = await axiosClient.patch(`/users/${user.id}`, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      avatar: avatarPreview,
      ...(newPasswordToUpdate && { password: newPasswordToUpdate }),
    });

    const updatedUser = res.data;

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    onUpdateSuccess(updatedUser);

    toast.success("Cập nhật thông tin thành công");
    onClose();
  } catch (error) {
    toast.error("Cập nhật thất bại, vui lòng thử lại");
  } finally {
    setLoading(false);
  }
};

  /* =======================
        RENDER
  ======================== */
  return (
    <div className="fixed inset-0 z-2000 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div
          className="flex-shrink-0 bg-gradient-to-r from-gray-900 via-black to-red-900
                text-white p-4 rounded-t-2xl relative"
        >
          <h2 className="text-lg font-semibold leading-tight">
            Thông tin tài khoản
          </h2>
          <p className="text-xs text-gray-300">Quản lý hồ sơ cá nhân</p>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* AVATAR */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              <img
                src={avatarPreview}
                className="w-24 h-24 rounded-full object-cover
                            ring-2 ring-red-400/40
                            transition-transform duration-200
                            group-hover:scale-105"
              />
              <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <Upload className="text-white" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Click để đổi ảnh đại diện</p>
          </div>

          {/* INFO */}
          <Input
            label="Họ"
            icon={<User size={16} />}
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            label="Tên"
            icon={<User size={16} />}
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="Email"
            icon={<Mail size={16} />}
            name="email"
            value={formData.email}
            disabled
            className="bg-gray-100 cursor-not-allowed text-gray-200"
          />
          <Input
            label="Số điện thoại"
            icon={<Phone size={16} />}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="Địa chỉ"
            icon={<MapPin size={16} />}
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {/* CHANGE PASSWORD TOGGLE */}
          <div
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="flex items-center justify-between cursor-pointer
             rounded-lg px-4 py-3
             bg-gray-50 hover:bg-gray-100
             transition"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lock size={16} />
              Đổi mật khẩu
              <span className="text-xs text-gray-400">(tuỳ chọn)</span>
            </div>
            {showChangePassword ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>

          {/* CHANGE PASSWORD FORM */}
          {showChangePassword && (
            <div
              className="
      mt-2 rounded-xl bg-gray-50 p-4
      space-y-3
      border border-gray-100
      animate-slideDown
    "
            >
              <PasswordInput
                label="Mật khẩu hiện tại"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PasswordInput
                  label="Mật khẩu mới"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  show={showNewPassword}
                  toggle={() => setShowNewPassword(!showNewPassword)}
                />

                <Input
                  label="Xác nhận mật khẩu"
                  icon={<Lock size={14} />}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                />
              </div>

              <p className="text-xs text-gray-400">
                • Mật khẩu tối thiểu 8 ký tự
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 p-5 border-t flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
    SMALL COMPONENTS
======================= */

const Input = ({ label, icon, disabled, className = "", ...props }: any) => (
  <div className="space-y-1">
    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
      {icon}
      {label}
    </label>

    <input
      {...props}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-sm rounded-md outline-none transition
        ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        }
        ${className}
      `}
    />
  </div>
);

const PasswordInput = ({ label, show, toggle, ...props }: any) => (
  <div className="space-y-1">
    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
      <Lock size={14} />
      {label}
    </label>

    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className=" w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition  focus:border-red-500  focus:ring-1 focus:ring-red-500 "
      />

      {toggle && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);
