import { useState, useEffect } from "react";
import { createPatient, updatePatient } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const AddPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editPatient = location.state?.patient;

  const [patient, setPatient] = useState({
    patientCode: "",
    fullName: "",
    dob: "",
    gender: "", 
    phone: "",
    email: "",
    address: "",
    bloodType: "",
    medicalHistory: "",
    allergies: "",
    insuranceNumber: "",
    status: "Ngoại trú",
    doctorId: ""
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load dữ liệu khi vào chế độ Chỉnh sửa
  useEffect(() => {
    if (editPatient) {
      setPatient({
        ...editPatient,
        dob: editPatient.dob ? editPatient.dob.split("T")[0] : "",
        doctorId: editPatient.doctorId ? editPatient.doctorId.toString() : ""
      });
    }
  }, [editPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // ✅ BƯỚC QUAN TRỌNG: Làm sạch dữ liệu gửi lên Backend
    // Loại bỏ các trường không được phép gửi hoặc object lồng nhau (doctor)
    const { doctor, createdAt, updatedAt, ...payload } = patient;

    const dataToSubmit = {
      ...payload,
      // Nếu thêm mới, để patientCode là null để Backend tự sinh mã theo quy tắc
      patientCode: editPatient ? patient.patientCode : null,
      // Ép kiểu doctorId về số nguyên hoặc null
      doctorId: patient.doctorId ? parseInt(patient.doctorId) : null,
      // Đảm bảo các chuỗi rỗng gửi lên là null để DB đẹp hơn
      medicalHistory: patient.medicalHistory || null,
      allergies: patient.allergies || null
    };

    try {
      if (editPatient) {
        await updatePatient(editPatient.id, dataToSubmit);
        setMessage("✅ Cập nhật hồ sơ bệnh nhân thành công!");
      } else {
        await createPatient(dataToSubmit);
        setMessage("✅ Tiếp nhận bệnh nhân mới thành công!");
      }

      // Quay lại danh sách sau 1.5s
      setTimeout(() => navigate("/patient"), 1500);
    } catch (error) {
      console.error("Lỗi API:", error.response?.data);
      const serverErrors = error.response?.data?.errors;
      const errorDetail = serverErrors 
        ? Object.values(serverErrors).flat().join(", ") 
        : "Vui lòng kiểm tra lại kết nối mạng hoặc dữ liệu nhập.";
      setMessage(`❌ Lỗi: ${errorDetail}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">
          {editPatient ? "Chỉnh sửa hồ sơ bệnh nhân" : "Tiếp nhận bệnh nhân mới"}
        </h3>
        <button className="btn btn-outline-secondary shadow-sm" onClick={() => navigate("/patient")}>
          Quay lại danh sách
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} shadow-sm border-0 animate__animated animate__fadeIn`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 bg-white">
        {/* Phần 1: Thông tin hành chính */}
        <h5 className="text-primary mb-3 border-bottom pb-2 fw-bold">1. Thông tin hành chính</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold small text-muted">Mã bệnh nhân</label>
            <input 
              type="text" 
              className="form-control bg-light fw-bold" 
              value={editPatient ? patient.patientCode : "HỆ THỐNG TỰ CẤP"} 
              disabled 
              readOnly 
            />
          </div>

          <div className="col-md-8 mb-3">
            <label className="form-label fw-bold small">Họ và tên <span className="text-danger">*</span></label>
            <input 
              type="text" 
              name="fullName" 
              className="form-control" 
              value={patient.fullName} 
              onChange={handleChange} 
              placeholder="Nhập tên đầy đủ..."
              required 
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold small">Ngày sinh <span className="text-danger">*</span></label>
            <input 
              type="date" 
              name="dob" 
              className="form-control" 
              value={patient.dob} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold small">Giới tính</label>
            <select name="gender" className="form-select" value={patient.gender} onChange={handleChange}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold small">Số BHYT</label>
            <input 
              type="text" 
              name="insuranceNumber" 
              className="form-control" 
              value={patient.insuranceNumber} 
              onChange={handleChange} 
              placeholder="VD: GD479..."
            />
          </div>
        </div>

        {/* Phần 2: Thông tin lâm sàng */}
        <h5 className="text-primary mt-4 mb-3 border-bottom pb-2 fw-bold">2. Thông tin liên lạc & Lâm sàng</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small">Số điện thoại</label>
            <input type="text" name="phone" className="form-control" value={patient.phone} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small">Địa chỉ thường trú</label>
            <input type="text" name="address" className="form-control" value={patient.address} onChange={handleChange} />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-bold small">Nhóm máu</label>
            <select name="bloodType" className="form-select" value={patient.bloodType} onChange={handleChange}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          <div className="col-md-9 mb-3">
            <label className="form-label fw-bold small">Email liên hệ</label>
            <input type="email" name="email" className="form-control" value={patient.email} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-danger">Tiền sử bệnh lý</label>
            <textarea 
              name="medicalHistory" 
              className="form-control" 
              rows="3" 
              value={patient.medicalHistory} 
              onChange={handleChange} 
              placeholder="Tiểu đường, cao huyết áp..."
            ></textarea>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold small text-danger">Dị ứng</label>
            <textarea 
              name="allergies" 
              className="form-control" 
              rows="3" 
              value={patient.allergies} 
              onChange={handleChange} 
              placeholder="Dị ứng thuốc kháng sinh, hải sản..."
            ></textarea>
          </div>
        </div>

        <div className="text-end mt-4 pt-3 border-top">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg px-5 shadow-sm fw-bold" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : (editPatient ? "CẬP NHẬT HỒ SƠ" : "LƯU HỒ SƠ BỆNH NHÂN")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;