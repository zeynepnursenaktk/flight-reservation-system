import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import PassengerLogin from "./pages/Passenger/PassengerLogin";
import Register from "./pages/Home/RegisterPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PassengerDashboard from "./pages/Passenger/PassengerDashboard";
import UcusAra from "./pages/Passenger/UcusAra";
import Bilgilerim from "./pages/Passenger/Bilgilerim";
import Rezervasyonlarim from "./pages/Passenger/Rezervasyonlarim";
import UcakDetaylari from "./pages/Admin/UcakDetaylari";
import UcusEkle from "./pages/Admin/UcusEkle";
import Rezervasyonlar from "./pages/Admin/Rezervasyonlar";
import KullaniciListesi from "./pages/Admin/KullaniciListesi";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/AdminGiris" element={<AdminLogin />} />
        <Route path="/MusteriGiris" element={<PassengerLogin />} />
        <Route path="/KayitOl" element={<Register />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/PassengerDashboard" element={<PassengerDashboard />} />
        <Route path="/UcusAra" element={<UcusAra />} /> {/* Yeni rota */}
        <Route path="/Bilgilerim" element={<Bilgilerim />} /> {/* Yeni rota */}
        <Route path="/Rezervasyonlarim" element={<Rezervasyonlarim />} />
        <Route path="/UcakDetaylari" element={<UcakDetaylari />} />
        <Route path="/UcusEkle" element={<UcusEkle />} />
        <Route path="/Rezervasyonlar" element={<Rezervasyonlar />} />
        <Route path="/KullaniciListesi" element={<KullaniciListesi />} />
      </Routes>
    </Router>
  );
}

export default App;
