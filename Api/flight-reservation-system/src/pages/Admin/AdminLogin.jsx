import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { Toaster, toast } from "react-hot-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    eposta: "",
    sifre: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API'ye giriş isteği gönderiyoruz.
      const response = await axios.post("/Kullanici/AdminGiris", {
        eposta: formData.eposta,
        sifre: formData.sifre,
      });

      if (response.status === 200) {
        const { kullanici } = response.data;

        const kullaniciBilgileri = {
          kullaniciId: kullanici.id,
          adSoyad: kullanici.ad,
        };

        localStorage.setItem(
          "kullaniciBilgileri",  // Yönetici bilgilerini localStorage'a kaydediyoruz.
          JSON.stringify(kullaniciBilgileri)
        );

        toast.success("Giriş başarılı! Yönetici paneline yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/AdminDashboard");
        }, 2000);
      }
    } catch (error) {
      toast.error("Giriş bilgileri yanlış. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw", // Tüm ekran genişliği
        height: "100vh", // Tüm ekran yüksekliği
        display: "flex", // Flexbox
        justifyContent: "center", // Yatayda ortalama
        alignItems: "center", // Dikeyde ortalama
        backgroundColor: "#1a1a1a", // Arkaplan rengi
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: "400px", // Sabit genişlik
          textAlign: "center", // İçeriği ortalama
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Admin Girişi
        </Typography>
        <Typography
          sx={{ marginBottom: "16px", fontSize: "0.95rem", color: "#666" }}
        >
          Yönetici paneline giriş yapmak için bilgilerinizi girin.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            name="eposta"
            label="E-posta"
            variant="outlined"
            type="email"
            fullWidth
            value={formData.eposta}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="sifre"
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.sifre}
            onChange={handleInputChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              height: "50px",
            }}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </Box>
        <Typography
          sx={{
            marginTop: "16px",
            fontSize: "0.85rem",
            color: "#666",
          }}
        >
          Erişim sorununuz mu var? Lütfen sistem yöneticinizle iletişime geçin.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
