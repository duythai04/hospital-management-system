import MainLayout from "../layouts/MainLayout";
import { getPatients } from "../services/api";
import { useEffect, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";

const Dashboard = () => {
  const [patients, setPatients] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatients();

        // ⚠️ fix trường hợp .NET trả $values
        const data = res.data.$values || res.data;

        setPatients(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <MainLayout>
      
      <h2 className="mb-5">
        Chào mừng bạn đến với hệ thống quản lý bệnh viện!
      </h2>

      {/* Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary p-3">
            <h6>Tổng bệnh nhân</h6>
            <h3>{patients.length}</h3> 
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success p-3">
            <h6>Tổng bác sĩ</h6>
            <h3>120</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning p-3">
            <h6>Tổng lịch hẹn</h6>
            <h3>325</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-danger p-3">
            <h6>Tổng hồ sơ bệnh án</h6>
            <h3>1.200</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Bệnh nhân mới nhất</h5>
          <button className="btn btn-primary btn-sm">
            Xem tất cả
          </button>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center">⏳ Đang tải...</div>
          ) : (
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Mã BN</th>
                  <th>Họ tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>SĐT</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 10).map((p) => ( 
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.full_name}</td>
                    <td>{p.gender}</td>
                    <td>{p.dob}</td>
                    <td>{p.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination (demo) */}
        <div className="card-footer text-center">
          <button className="btn btn-light btn-sm me-2">{"<"}</button>
          <button className="btn btn-primary btn-sm me-2">1</button>
          <button className="btn btn-light btn-sm">2</button>
        </div>
      </div>

      <DashboardCharts patients={patients} />
    </MainLayout>
  );
};

export default Dashboard;