import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "../api/axiosConfig"; // Axios config dosyanız

const Register = () => {
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    eposta: "",
    telefon: "",
    sifre: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sifre !== formData.sifreOnay) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    try {
      const response = await axios.post("/api/Kullanici/KayitOl", {
        ad: formData.ad,
        soyad: formData.soyad,
        eposta: formData.eposta,
        telefon: formData.telefon,
        sifre: formData.sifre,
        rolId: 2, // Yolcu rolü için
      });
      if (response.status === 200) {
        // Kayıt başarılı, yolcu girişine yönlendir
        navigate("/YolcuGiris");
      }
    } catch (error) {
      console.error("Kayıt işlemi başarısız:", error.response.data);
      setError("Kayıt işlemi başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "32px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        minWidth: "300px",
        maxWidth: "400px",
        width: "90%",
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
      {error && (
        <Typography variant="body2" color="error" sx={{ marginBottom: "16px" }}>
          {error}
        </Typography>
      )}
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
          sx={{ marginTop: "16px", padding: "10px", fontWeight: "bold" }}
        >
          Kayıt Ol
        </Button>
      </form>
    </Box>
  );
};

export default Register;
