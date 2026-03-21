import { FaBell } from "react-icons/fa";

const Header = () => {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2 bg-white border-bottom position-fixed"
      style={{
        height: "70px",
        top: 0,
        left: "250px", 
        right: 0,
        zIndex: 1000
      }}
    >
      {/* Left */}
      <h5 className="mb-0 fw-bold">HOSPITALL</h5>

      {/* Right */}
      <div className="d-flex align-items-center gap-3">
        
        {/* Search */}
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ width: "250px" }}
        />

        {/* Notification */}
        <div className="position-relative">
          <FaBell size={20} />
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
            style={{ fontSize: "10px" }}
          >
            3
          </span>
        </div>

        {/* Avatar */}
        <div className="d-flex align-items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="rounded-circle"
            width="40"
            height="40"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;