import MainLayout from "../layouts/MainLayout";
import { getPatients } from "../services/api";
import { useEffect, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import { Spinner, Badge } from "react-bootstrap";

const Dashboard = () => {
  const [patients, setPatients] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatients();
        // Xử lý cả trường hợp .NET trả về $values hoặc mảng trực tiếp
        const data = res.data.$values || res.data;
        setPatients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 className="fw-bold">Hệ thống Quản lý Bệnh viện</h2>
        <p className="text-muted">Tổng quan tình hình bệnh viện ngày {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="opacity-75">Tổng bệnh nhân</h6>
                <h2 className="fw-bold mb-0">{patients.length}</h2>
              </div>
              <i className="bi bi-people fs-1 opacity-25"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white p-3">
            <h6 className="opacity-75">Bác sĩ trực</h6>
            <h2 className="fw-bold mb-0">12</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-info text-white p-3">
            <h6 className="opacity-75">Lịch hẹn hôm nay</h6>
            <h2 className="fw-bold mb-0">45</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-white p-3">
            <h6 className="opacity-75">Phòng trống</h6>
            <h2 className="fw-bold mb-0">8</h2>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">Bệnh nhân mới tiếp nhận</h5>
          <button className="btn btn-outline-primary btn-sm px-3" onClick={() => window.location.href = '/patient'}>
            Xem tất cả
          </button>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="p-5 text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary">
                  <tr>
                    <th className="ps-4">Mã BN</th>
                    <th>Họ tên</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Trạng thái</th>
                    <th>SĐT</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    // Lấy 5 bệnh nhân mới nhất (giả sử danh sách từ API đã được sắp xếp theo CreatedAt)
                    patients.slice(0, 5).map((p) => ( 
                      <tr key={p.id}>
                        <td className="ps-4 fw-bold text-primary">
                          {p.patientCode || `BN-${p.id}`}
                        </td>
                        <td className="fw-bold">{p.fullName}</td>
                        <td>{p.gender}</td>
                        <td>{p.dob ? new Date(p.dob).toLocaleDateString('vi-VN') : "---"}</td>
                        <td>
                          <Badge bg={p.status === "Nội trú" ? "danger" : "info"} pill>
                            {p.status || "Ngoại trú"}
                          </Badge>
                        </td>
                        <td className="text-muted">{p.phone || "---"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">Chưa có dữ liệu bệnh nhân</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        <div className="col-12">
          <DashboardCharts patients={patients} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;