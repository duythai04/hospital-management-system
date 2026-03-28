import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import Sidebar from "./components/Sidebar";
import AddPatient from "./pages/AddPatient";
import PatientDetail from "./pages/PatientDetail";
import Login from "./components/Login";


function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar/>
          
        <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
          <Header />

          <div className="p-4" style={{ marginTop: "90px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patient" element={<PatientList/>} />
              <Route path = "/add-patient" element={<AddPatient/>}/>
              <Route path = "/patient-detail/:id" element = {<PatientDetail/>}/>
              <Route path = "/login" element = {<Login/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}



export default App;