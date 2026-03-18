import React, {useState, useEffect}from 'react';
import { Table, Button, Card, Badge, Pagination, Row, Col } from 'react-bootstrap';
import { FaPlus, FaFileExport, FaFilter, FaEye, FaEdit, FaTrashAlt, FaSort } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { getPatients, deletePatient, updatePatient } from '../services/api';

const PatientList = () => {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getPatients();
        setPatients(res.data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách bệnh nhân", error);
        
      }finally{
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);


  const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa?")) return;

  try {
    await deletePatient(id);

    setPatients(prev => prev.filter(p => p.id !== id));
  } catch (error) {
    console.error("Lỗi xóa", error);
  }
  };


  const handleUpdate = async (patient) => {
    try {
      const updatedData = {
        ...patient,
        full_name: patient.full_name + " (Đã sửa)" 
      };

      await updatePatient(patient.id, updatedData);

      // cập nhật lại UI
      setPatients(prev =>
        prev.map(p => p.id === patient.id ? updatedData : p)
      );

      alert("Cập nhật thành công");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="p-4 bg-light" style={{ minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">


        <NavLink to={"/add-patient"} style={{ textDecoration: "none" }}> 
          <Button variant="teal" style={{ backgroundColor: '#00796b', color: '#fff' }} className="d-flex align-items-center">
            <FaPlus className="me-2" /> Thêm bệnh nhân
          </Button>

        </NavLink>
        

        <div className="text-muted small">
          Dashboard {'>'} <span className="text-danger">Patient List</span>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {/* Table Header Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <h5 className="mb-0 fw-bold">Danh sách bệnh nhân</h5>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                <FaFileExport className="me-1" /> Export
              </Button>
              <Button variant="outline-secondary" size="sm">
                <FaFilter className="me-1" /> Filter
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table responsive hover className="mb-0 custom-table">
            <thead className="bg-light text-muted">
              <tr>
                <th className="ps-4">Mã BN<FaSort className="ms-1 small" /></th>
                <th>Họ và tên<FaSort className="ms-1 small" /></th>
                <th>Giới tính<FaSort className="ms-1 small" /></th>
                <th>Điện thoại<FaSort className="ms-1 small" /></th>
                <th>Địa chỉ<FaSort className="ms-1 small" /></th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id} style={{ backgroundColor: index % 2 !== 0 ? '#f8f9fa' : '#fff' }}>
                  <td className="ps-4 py-3">{patient.id}</td>
                  <td>{patient.full_name}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.address}</td>
                  <td>
                  </td>
                  <td className="text-center">

                    <Button variant="light" size="sm" className="text-teal me-1 border shadow-sm">
                      <FaEye size={12} className="text-success" />
                    </Button>

                    <NavLink
                      to="/add-patient"
                      state={{ patient: patient }}
                    >
                      <Button variant="light" size="sm" className="text-primary me-1 border shadow-sm">
                        <FaEdit size={12} className="text-info" />
                      </Button>
                    </NavLink>

                    <Button variant="light" size="sm" onClick={() => handleDelete(patient.id)} className="text-danger border shadow-sm">
                      <FaTrashAlt size={12} className="text-danger" />
                    </Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Footer / Pagination */}
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <div className="text-muted small">Showing 1 to 10 of 14 entries</div>
            <Pagination size="sm" className="mb-0">
              <Pagination.First />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Item active>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Last />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
      
      <footer className="mt-4 text-muted small">
        Copyright © 2026 HealthEase Medical. All rights reserved.
      </footer>
    </div>
  );
};

export default PatientList;