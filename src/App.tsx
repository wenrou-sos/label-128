import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Appointment from "@/pages/Appointment";
import AppointmentSuccess from "@/pages/AppointmentSuccess";
import Queue from "@/pages/Queue";
import CheckIn from "@/pages/CheckIn";
import Doctors from "@/pages/Doctors";
import DoctorSchedule from "@/pages/DoctorSchedule";
import HealthRecord from "@/pages/HealthRecord";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment/success" element={<AppointmentSuccess />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorSchedule />} />
        <Route path="/health" element={<HealthRecord />} />
      </Routes>
    </Router>
  );
}
