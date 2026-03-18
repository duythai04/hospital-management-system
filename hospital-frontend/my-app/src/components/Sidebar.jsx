import {
  FaHome,
  FaUserInjured,
  FaUserMd,
  FaCalendarAlt,
  FaFileInvoice,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import './Sidebar.css'
import { MdLocalHospital } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header text-center">
        <div className="logo-circle"><MdLocalHospital /></div>
        <h6>QUẢN LÝ BỆNH VIỆN</h6>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            <FaHome />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/patient" className={({ isActive }) => isActive ? "active" : ""}>
            <FaUserInjured />
            <span>Bệnh nhân</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/doctor" className={({ isActive }) => isActive ? "active" : ""}>
            <FaUserMd />
            <span>Bác sĩ</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/appointment" className={({ isActive }) => isActive ? "active" : ""}>
            <FaCalendarAlt />
            <span>Lịch hẹn</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/invoice" className={({ isActive }) => isActive ? "active" : ""}>
            <FaFileInvoice />
            <span>Hóa đơn</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
            <FaUsers />
            <span>Người dùng</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/report" className={({ isActive }) => isActive ? "active" : ""}>
            <FaChartBar />
            <span>Báo cáo</span>
          </NavLink>
        </li>
      </ul>

      {/* Bottom */}
      <div className="sidebar-footer">
        <FaCog />
        <span>Cài đặt</span>
      </div>
    </div>
  );
};

export default Sidebar;