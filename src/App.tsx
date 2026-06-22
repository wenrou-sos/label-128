import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Appointment from "@/pages/Appointment";
import AppointmentSuccess from "@/pages/AppointmentSuccess";
import Queue from "@/pages/Queue";
import CheckIn from "@/pages/CheckIn";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment/success" element={<AppointmentSuccess />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/checkin" element={<CheckIn />} />
      </Routes>
    </Router>
  );
}
