import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const PassengerDashboardLayout = ({ children }) => {
  const kullaniciBilgileri = JSON.parse(localStorage.getItem("kullaniciBilgileri"));

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          backgroundColor: "#1976d2",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Hoşgeldiniz, {kullaniciBilgileri?.adSoyad || "Kullanıcı"}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              backgroundColor: "#ffffff22",
              ":hover": {
                backgroundColor: "#ffffff44",
              },
            }}
          >
            Çıkış
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #ddd",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => navigate("/PassengerDashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate("/UcusAra")}>
              <ListItemText primary="Uçuş Ara" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate("/Rezervasyonlarim")}>
              <ListItemText primary="Rezervasyonlarım" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate("/Bilgilerim")}>
              <ListItemText primary="Bilgilerim" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: "240px",
          marginTop: "64px",
          padding: "24px",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            width: "100%",
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PassengerDashboardLayout;
