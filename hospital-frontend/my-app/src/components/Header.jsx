import { FaBell } from "react-icons/fa";

const Header = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2 bg-white border-bottom position-fixed"
      style={{
        height: "70px",
        top: 0,
        left: "250px",
        right: 0,
        zIndex: 1000,
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

        {/* Nếu đã login */}
        {token ? (
          <div className="d-flex align-items-center gap-3">
            
            {/* Info */}
            <div className="text-end">
              <div style={{ fontSize: "14px", fontWeight: "500" }}>
                {email}
              </div>
              <div style={{ fontSize: "12px", color: "gray" }}>
                {role}
              </div>
            </div>

            {/* Avatar */}
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="rounded-circle"
              width="40"
              height="40"
            />

            {/* Logout */}
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          // Nếu chưa login
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;