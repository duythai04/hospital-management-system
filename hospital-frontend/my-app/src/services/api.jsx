import axios from "axios";

// 1. Tạo instance API với cấu hình cơ sở
const API = axios.create({
  baseURL: "http://localhost:5096/api",
});

// 2. Cấu hình Interceptor để tự động gắn Token vào Header của mọi request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Định nghĩa các hàm gọi API sử dụng instance "API" đã cấu hình ở trên
// Lưu ý: Đường dẫn truyền vào chỉ cần là phần sau của baseURL (ví dụ: "/Patient")

export const getPatients = async () => {
  // Sử dụng API.get thay vì axios.get
  return await API.get("/Patient");
};

export const getPatientById = async (id) => {
  return await API.get(`/Patient/${id}`);
};

export const createPatient = async (data) => {
  // Dữ liệu 'data' sẽ được gửi kèm Header Authorization tự động
  return await API.post("/Patient", data);
};

export const updatePatient = async (id, data) => {
  return await API.put(`/Patient/${id}`, data);
};

export const deletePatient = async (id) => {
  return await API.delete(`/Patient/${id}`);
};

// Xuất instance API để sử dụng ở các nơi khác nếu cần
export default API;