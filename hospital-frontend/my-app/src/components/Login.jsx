import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  // Thống nhất dùng chữ thường cho key để dễ quản lý
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend yêu cầu LoginRequest (Email, Password) 
      // Axios sẽ gửi object { email, password }
      const res = await axios.post(
        "http://localhost:5096/api/Auth/login",
        form
      );

      // ✅ Lưu thông tin vào LocalStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", form.email); 

      alert("Đăng nhập thành công!");

      // Chuyển hướng trang
      window.location.href = "/patients";
    } catch (err) {
      console.error("Login Error:", err.response?.data);

      if (err.response?.status === 401) {
        alert("Sai tài khoản hoặc mật khẩu!");
      } else if (err.response?.status === 400) {
        // Nếu vẫn bị 400, in ra chi tiết lỗi từ ModelState của Backend
        console.table(err.response.data.errors);
        alert("Dữ liệu gửi lên không hợp lệ (Lỗi 400)");
      } else {
        alert("Không thể kết nối đến Server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f5f6fa" }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "350px", borderRadius: "10px" }}
      >
        <h3 className="text-center mb-3">Đăng nhập</h3>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email" // Khớp với key trong useState
              className="form-control"
              placeholder="admin@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password" // Khớp với key trong useState
              className="form-control"
              placeholder="******"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang xử lý...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;