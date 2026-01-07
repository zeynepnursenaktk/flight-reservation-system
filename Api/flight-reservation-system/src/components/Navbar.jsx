import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {

  // Sayfa yönlendirme işlemini gerçekleştiren fonksiyon.
  const handleNavigation = (path) => {
    toast.success(`"${path === '/AdminGiris' ? 'Admin Girişi' : 'Yolcu Girişi'}" sayfasına yönlendiriliyorsunuz...`);
    setTimeout(() => {
      window.location.href = path;
    }, 1000);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sabit bir üst menü (Navbar) oluşturuluyor */}
      <AppBar position="fixed" sx={{ backgroundColor: "#1976d2", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            ✈️ Uçuş Rezervasyon Sistemi
          </Typography>
          <Box>
            {/* Admin Girişi butonu */}
            <Button
              color="inherit"
              onClick={() => handleNavigation("/AdminGiris")}
              sx={{ fontSize: "16px", fontWeight: "bold", textTransform: "none", marginRight: 2 }}
            >
              Admin Girişi
            </Button>
            {/* Yolcu Girişi butonu */}
            <Button
              color="inherit"
              onClick={() => handleNavigation("/MusteriGiris")}
              sx={{ fontSize: "16px", fontWeight: "bold", textTransform: "none" }}
            >
              Yolcu Girişi
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
