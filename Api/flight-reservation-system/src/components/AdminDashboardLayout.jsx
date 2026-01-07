import React from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


// AdminDashboardLayout bileşeni tanımlanıyor.
const AdminDashboardLayout = ({ children }) => {

  // Admin bilgilerini localStorage'dan alıyoruz.
  const adminBilgileri = JSON.parse(localStorage.getItem("adminBilgileri"));
  const navigate = useNavigate();        // Sayfa yönlendirme işlemleri için navigate fonksiyonunu kullanıyoruz.


  // Çıkış işlemini gerçekleştiren fonksiyon.
  const handleLogout = () => {
    localStorage.removeItem("adminBilgileri");   // Admin bilgilerini localStorage'dan siliyoruz.
    navigate("/");
  };

  return (
    // Dashboard için genel düzen kutusu oluşturuluyor.
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hoşgeldiniz, {adminBilgileri?.adSoyad || "Admin"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Çıkış
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sol menü (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => navigate("/AdminDashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate("/UcakDetaylari")}>
              <ListItemText primary="Uçak Detayları" />
            </ListItem>
            <ListItem button onClick={() => navigate("/UcusEkle")}>
              <ListItemText primary="Uçak Ekle" />
            </ListItem>
            <ListItem button onClick={() => navigate("/Rezervasyonlar")}>
              <ListItemText primary="Rezervasyonlar" />
            </ListItem>
            <ListItem button onClick={() => navigate("/KullaniciListesi")}>
              <ListItemText primary="Kullanıcılar" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "240px",
          marginTop: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminDashboardLayout;