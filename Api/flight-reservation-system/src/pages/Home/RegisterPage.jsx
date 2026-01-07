import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../../api/axiosConfig";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  // Form verilerini ve yüklenme durumunu yönetmek için state kullanıyoruz.
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    eposta: "",
    telefon: "",
    sifre: "",
    sifreOnay: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Formdaki giriş alanlarında yapılan değişiklikleri yönetir.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  // State'i güncelliyoruz.
  };


  // Form gönderildiğinde çalışacak işlemler.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sifre !== formData.sifreOnay) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    
    try {
      // API'ye kayıt isteği gönderiyoruz.
      const response = await axios.post("/Kullanici/KayitOl", {
        ad: formData.ad,
        soyad: formData.soyad,
        eposta: formData.eposta,
        telefon: formData.telefon,
        sifre: formData.sifre,
      });
      if (response.status === 200) {
        toast.success("Kayıt başarılı! Ana Sayfaya yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw", // Tam ekran genişlik
        height: "100vh", // Tam ekran yükseklik
        display: "flex", // Flexbox düzeni
        justifyContent: "center", // Yatay hizalama
        alignItems: "center", // Dikey hizalama
        backgroundColor: "#f5f5f5", // Arkaplan rengi
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        sx={{
          backgroundColor: "white",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
          width: "400px", // Form genişliği
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
        >
          Kayıt Ol
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="ad"
            label="Ad"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.ad}
            onChange={handleInputChange}
          />
          <TextField
            name="soyad"
            label="Soyad"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.soyad}
            onChange={handleInputChange}
          />
          <TextField
            name="eposta"
            label="E-posta"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.eposta}
            onChange={handleInputChange}
          />
          <TextField
            name="telefon"
            label="Telefon"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.telefon}
            onChange={handleInputChange}
          />
          <TextField
            name="sifre"
            label="Şifre"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.sifre}
            onChange={handleInputChange}
          />
          <TextField
            name="sifreOnay"
            label="Şifreyi Onayla"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.sifreOnay}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: "16px", padding: "10px", fontWeight: "bold" }}
          >
            {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
