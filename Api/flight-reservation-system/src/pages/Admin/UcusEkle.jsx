import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";

const UcusEkle = () => { 
   // Form verilerini tutmak için state.
  const [formData, setFormData] = useState({
    kalkisSehri: "",
    varisSehri: "",
    kalkisTarihi: "",
    fiyat: "",
    koltukSayisi: "",
    ucusTuru: "",      // Uçuş türü (Tek Yön veya Gidiş Dönüş).
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  // Formdaki bir input değiştiğinde çağrılan fonksiyon.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form gönderildiğinde çağrılan fonksiyon.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // Backend'e gönderilecek veri hazırlanıyor.
      const postData = {
        kalkisSehri: formData.kalkisSehri.trim(),
        varisSehri: formData.varisSehri.trim(),
        kalkisTarihi: new Date(formData.kalkisTarihi).toISOString(),
        fiyat: parseFloat(formData.fiyat),
        koltukSayisi: parseInt(formData.koltukSayisi, 10),
        ucusTuru: formData.ucusTuru, // Uçuş türü backend'e gönderiliyor
      };

      console.log("Gönderilen Veri:", postData);

      // API'ye POST isteği gönderiliyor.
      const response = await axios.post("/Admin/UcusEkle", postData);

      if (response.status === 200) {
        setSuccessMessage("Uçuş başarıyla eklendi.");
        setFormData({
          kalkisSehri: "",
          varisSehri: "",
          kalkisTarihi: "",
          fiyat: "",
          koltukSayisi: "",
          ucusTuru: "",
        });
      }
    } catch (err) {
      console.error("Uçuş ekleme işlemi başarısız:", err.response || err);
      setError(
        err.response?.data?.Message || "Uçuş eklenirken bir hata oluştu."
      );
    }
  };

  return (
    <AdminDashboardLayout>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            backgroundColor: "#f5f5f5",
            borderRadius: "16px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              marginBottom: "16px",
            }}
          >
            Uçuş Ekle
          </Typography>
          {error && (
            <Typography
              color="error"
              textAlign="center"
              sx={{
                mb: 2,
                fontWeight: "bold",
                backgroundColor: "#fdecea",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography
              color="success"
              textAlign="center"
              sx={{
                mb: 2,
                fontWeight: "bold",
                backgroundColor: "#e7f5e4",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              {successMessage}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              name="kalkisSehri"
              label="Kalkış Şehri"
              variant="outlined"
              fullWidth
              value={formData.kalkisSehri}
              onChange={handleInputChange}
            />
            <TextField
              name="varisSehri"
              label="Varış Şehri"
              variant="outlined"
              fullWidth
              value={formData.varisSehri}
              onChange={handleInputChange}
            />
            <TextField
              name="kalkisTarihi"
              label="Kalkış Tarihi"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={formData.kalkisTarihi}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="fiyat"
              label="Fiyat (TL)"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.fiyat}
              onChange={handleInputChange}
            />
            <TextField
              name="koltukSayisi"
              label="Koltuk Sayısı"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.koltukSayisi}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel id="ucus-turu-label">Uçuş Türü</InputLabel>
              <Select
                labelId="ucus-turu-label"
                name="ucusTuru"
                value={formData.ucusTuru}
                onChange={handleInputChange}
                variant="outlined"
              >
                <MenuItem value="Tek Yön">Tek Yön</MenuItem>
                <MenuItem value="Gidiş Dönüş">Gidiş Dönüş</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                backgroundColor: "#3f51b5",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#283593",
                },
              }}
            >
              Uçuş Ekle
            </Button>
          </Box>
        </Paper>
      </Container>
    </AdminDashboardLayout>
  );
};

export default UcusEkle;
