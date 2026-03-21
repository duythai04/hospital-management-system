import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Pagination, Spinner, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaFileExport, FaSearch, FaEye, FaEdit, FaTrashAlt, FaSort } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { getPatients, deletePatient } from '../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients();
      // res.data sẽ chứa danh sách bệnh nhân với các key PascalCase từ Backend được map thành camelCase (tùy cấu hình JSON)
      setPatients(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa hồ sơ này?")) return;
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert("Lỗi hệ thống: Không thể xóa bệnh nhân này.");
    }
  };

  // Lọc bệnh nhân theo tên hoặc mã
  const filteredPatients = patients.filter(p => 
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.patientCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-light" style={{ minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Quản lý Bệnh nhân</h4>
          <p className="text-muted small mb-0">Hệ thống {'>'} Danh sách hồ sơ</p>
        </div>
        <NavLink to={"/add-patient"} style={{ textDecoration: "none" }}>
          <Button variant="success" className="d-flex align-items-center shadow-sm px-3 py-2" style={{ backgroundColor: '#00796b', border: 'none' }}>
            <FaPlus className="me-2" /> Tiếp nhận bệnh nhân
          </Button>
        </NavLink>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <Card.Body className="p-0">
          {/* Toolbar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 gap-3">
            <InputGroup className="max-width-300 shadow-sm" style={{ maxWidth: '350px' }}>
              <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm tên hoặc mã bệnh nhân..."
                className="border-start-0 ps-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                <FaFileExport className="me-1" /> Xuất Excel
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5 py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle border-top">
              <thead className="bg-light">
                <tr className="text-secondary">
                  <th className="ps-4 py-3">Mã BN <FaSort className="ms-1 small" /></th>
                  <th>Họ và tên <FaSort className="ms-1 small" /></th>
                  <th>Giới tính</th>
                  <th>Điện thoại</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="ps-4 fw-bold text-primary">
                        {patient.patientCode || `BN-${patient.id}`}
                      </td>
                      <td>
                        <div className="fw-bold">{patient.fullName}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{patient.email || 'N/A'}</div>
                      </td>
                      <td>{patient.gender}</td>
                      <td>{patient.phone || '---'}</td>
                      <td>
                        <Badge 
                          pill 
                          bg={patient.status === "Nội trú" ? "danger" : "info"}
                          className="px-2 py-1"
                        >
                          {patient.status || "Ngoại trú"}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-success border shadow-sm"
                            title="Xem chi tiết"
                            onClick={() => navigate(`/patient-detail/${patient.id}`)}
                          >
                            <FaEye />
                          </Button>

                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-info border shadow-sm"
                            title="Sửa hồ sơ"
                            onClick={() => navigate("/add-patient", { state: { patient: patient } })}
                          >
                            <FaEdit />
                          </Button>

                          <Button 
                            variant="light" 
                            size="sm" 
                            className="text-danger border shadow-sm"
                            title="Xóa hồ sơ"
                            onClick={() => handleDelete(patient.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      {searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : "Chưa có bệnh nhân nào trong danh sách."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* Footer */}
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-white">
            <div className="text-muted small">
              Hiển thị <strong>{filteredPatients.length}</strong> trên tổng số <strong>{patients.length}</strong> hồ sơ
            </div>
            <Pagination size="sm" className="mb-0">
              <Pagination.Prev disabled />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Next disabled />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      
      <footer className="mt-4 text-muted small text-center pb-3">
        Copyright © 2026 HealthEase Medical. All rights reserved.
      </footer>
    </div>
  );
};

export default PatientList;