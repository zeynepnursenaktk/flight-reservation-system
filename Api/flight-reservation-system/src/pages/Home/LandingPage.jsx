import React from "react";
import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";

const LandingPage = () => {
  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
    </div>
  );
};

export default LandingPage;
