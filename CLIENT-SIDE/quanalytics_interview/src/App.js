import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Home from "./components/home/Home";
import Footer from "./components/layout/Footer";
import NavBar from "./components/layout/NavBar";
import AddEditPatient from "./components/patient/AddEditPatient";
import PatientListView from "./components/patient/PatientListView";
import VisitReport from "./components/report/visitReport";
import AddEditVisit from "./components/visits/AddEditVisit";
import PatientsVisitsListView from "./components/visits/PatientsVisitsListView";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";


function App() {
  return (
    <main>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-list" element={<PatientListView />} />
        <Route path="/add-patient" element={<AddEditPatient />} />
        <Route path="/edit-patient/:patientId" element={<AddEditPatient />} />
        <Route path="/patient-visit" element={<PatientsVisitsListView />} /> 
        <Route path="/add-visit/:patientId" element={<AddEditVisit/>} />
        <Route path="/edit-visit/:visitId/:patientId" element={<AddEditVisit/>} />
        <Route path="/add-visit-with-no-params" element={<AddEditVisit/>} />
        <Route path="/patient-visit-report" element={<VisitReport/>} />
      </Routes>
    </Router>
    <Footer />
  </main>
  );
}

export default App;
