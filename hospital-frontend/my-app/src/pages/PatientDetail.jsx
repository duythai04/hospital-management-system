import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../services/api";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatientById(id);
        setPatient(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết bệnh nhân:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!patient) {
    return <Container className="mt-5 text-center"><h5>Không tìm thấy dữ liệu bệnh nhân.</h5></Container>;
  }

  // Hàm tính tuổi chính xác hơn
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <Container className="patient-detail mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <Badge bg={patient.status === "Nội trú" ? "danger" : "success"}>
          {patient.status || "Ngoại trú"}
        </Badge>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0 text-center">HỒ SƠ BỆNH NHÂN CHI TIẾT</h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="mb-4">
            <Col md={12} className="border-bottom pb-2 mb-3">
              <h5 className="text-secondary"># {patient.patientCode || "Chưa có mã"}</h5>
              <h2 className="text-uppercase fw-bold">{patient.fullName}</h2>
            </Col>
            
            <Col md={6}>
              <p><strong>Giới tính:</strong> {patient.gender}</p>
              <p><strong>Ngày sinh:</strong> {new Date(patient.dob).toLocaleDateString('vi-VN')}</p>
              <p><strong>Tuổi:</strong> {calculateAge(patient.dob)}</p>
              <p><strong>Nhóm máu:</strong> <Badge bg="info">{patient.bloodType || "Chưa xác định"}</Badge></p>
            </Col>

            <Col md={6}>
              <p><strong>Số điện thoại:</strong> {patient.phone || "---"}</p>
              <p><strong>Email:</strong> {patient.email || "---"}</p>
              <p><strong>Số BHYT:</strong> {patient.insuranceNumber || "---"}</p>
              <p><strong>Ngày tiếp nhận:</strong> {new Date(patient.createdAt).toLocaleDateString('vi-VN')}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <p><strong>Địa chỉ:</strong> {patient.address || "Chưa cập nhật địa chỉ"}</p>
            </Col>
          </Row>

          <hr />

          <Row>
            <Col md={6} className="mb-3">
              <Card className="bg-light border-0">
                <Card.Body>
                  <h6 className="fw-bold text-danger">Tiền sử bệnh lý</h6>
                  <p className="mb-0">{patient.medicalHistory || "Không có tiền sử bệnh lý đặc biệt."}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="bg-light border-0">
                <Card.Body>
                  <h6 className="fw-bold text-danger">Dị ứng</h6>
                  <p className="mb-0">{patient.allergies || "Không có tiền sử dị ứng."}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Hiển thị bác sĩ phụ trách nếu có */}
          {patient.doctor && (
            <Row className="mt-3">
              <Col>
                <div className="p-3 border rounded bg-white">
                  <strong>Bác sĩ phụ trách:</strong> <span className="text-primary">{patient.doctor.name}</span>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatientDetail;