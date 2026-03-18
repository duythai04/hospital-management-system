import { useState, useEffect } from "react";
import { createPatient, updatePatient } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const AddPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editPatient = location.state?.patient;

  const [patient, setPatient] = useState({
    full_name: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    blood_type: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Nếu là edit → đổ dữ liệu vào form
  useEffect(() => {
    if (editPatient) {
      setPatient(editPatient);
    }
  }, [editPatient]);

  // handle input
  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editPatient) {
        // ✅ UPDATE
        await updatePatient(editPatient.id, patient);
        setMessage("✅ Cập nhật bệnh nhân thành công!");
      } else {
        // ✅ ADD
        await createPatient(patient);
        setMessage("✅ Thêm bệnh nhân thành công!");
      }

      // reset form
      setPatient({
        full_name: "",
        dob: "",
        gender: "",
        phone: "",
        address: "",
        blood_type: "",
      });

      // quay lại list (tuỳ chọn)
      setTimeout(() => navigate("/patient"), 1000);

    } catch (error) {
      console.error(error);
      setMessage("❌ Lỗi!");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">
        {editPatient ? "Cập nhật bệnh nhân" : "Thêm bệnh nhân"}
      </h3>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="row">

          <div className="col-md-6 mb-3">
            <label>Họ và tên</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              value={patient.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dob"
              className="form-control"
              value={patient.dob || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Giới tính</label>
            <select
              name="gender"
              className="form-control"
              value={patient.gender}
              onChange={handleChange}
            >
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={patient.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={patient.address}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Nhóm máu</label>
            <select
              name="blood_type"
              className="form-control"
              value={patient.blood_type}
              onChange={handleChange}
            >
              <option value="">-- Chọn --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

        </div>

        <button type="submit" className="btn btn-primary">
          {editPatient ? "Cập nhật" : "Thêm bệnh nhân"}
        </button>
      </form>
    </div>
  );
};

export default AddPatient;