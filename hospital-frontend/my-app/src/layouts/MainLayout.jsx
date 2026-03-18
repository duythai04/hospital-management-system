import './MainLayout.css';


const MainLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <div className="flex-grow-1 bg-light min-vh-100">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;