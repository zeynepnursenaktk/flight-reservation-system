import React from "react";
import backgroundImg from "../shared/background.jpg";
import { Box, Typography, Button, Container } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

const HeroSection = () => {

  // "Kayıt Ol" butonuna tıklandığında çalışan fonksiyon
  const handleSignUp = () => {
    toast.success("Kayıt ol sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => {
      window.location.href = "/KayitOl";
    }, 1000);
  };

  return (
    // Arka plan kutusu oluşturuluyor.
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        filter: "brightness(0.8)",
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <Container maxWidth="sm">
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
          }}
        >
          Dünyayı Keşfetmeye Hazır Mısınız?
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            marginBottom: 3,
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          En uygun fiyatlarla uçak rezervasyonunuzu hemen yapın!
        </Typography>

        {/* Kayıt Ol butonu */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSignUp}
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            textTransform: "none",
          }}
        >
          Kayıt Ol
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
