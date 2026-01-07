import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import { Toaster, toast } from "react-hot-toast";
import PassengerDashboardLayout from "../../components/PassengerDashboardLayout"; // DashboardLayout'u ekliyoruz

const Bilgilerim = () => { 
  const [formData, setFormData] = useState({         // Kullanıcı form bilgilerini saklamak için state.
    telefon: "", 
    mevcutSifre: "",
    yeniSifre: "",
  });
  const [kullanici, setKullanici] = useState(null);  // Kullanıcı bilgilerini saklamak için state.

  const kullaniciBilgileri = JSON.parse(
    localStorage.getItem("kullaniciBilgileri")       // Kullanıcı bilgilerini localStorage'dan alıyoruz.
  );

  // Kullanıcı bilgilerini API'den almak için kullanılan fonksiyon.
  const fetchKullaniciBilgileri = async () => {
    try {
      const response = await axios.get("/Musteri/Bilgilerim", {
        params: { userId: kullaniciBilgileri.kullaniciId },          // Kullanıcı ID'sini API'ye parametre olarak gönderiyoruz.
      });  
      setKullanici(response.data);                                   // API'den gelen kullanıcı bilgilerini state'e kaydediyoruz.
      setFormData({ ...formData, telefon: response.data.telefon });  // Telefon numarasını form state'ine ekliyoruz.
    } catch (error) {
      console.error("Kullanıcı bilgileri alınırken hata oluştu:", error);
      toast.error("Bilgiler yüklenirken bir hata oluştu.");
    }
  };

  // İlk yüklemede kullanıcı bilgilerini çekmek için effect hook'u kullanıyoruz.
  useEffect(() => {
    if (kullaniciBilgileri?.kullaniciId) {    // Kullanıcı ID kontrolü yapıyoruz.
      fetchKullaniciBilgileri();              // Kullanıcı bilgilerini çekiyoruz.
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Kullanıcı bilgilerini güncellemek için kullanılan fonksiyon.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put( 
        "/Musteri/Bilgilerim",                                        // Güncelleme isteği için API endpoint.
        {
          telefon: formData.telefon,
          mevcutSifre: formData.mevcutSifre,
          yeniSifre: formData.yeniSifre,
        },
        {
          params: { userId: kullaniciBilgileri.kullaniciId },        // Kullanıcı ID'sini API'ye parametre olarak gönderiyoruz. 
        }
      );
      toast.success(response.data); 
    } catch (error) {
      console.error("Bilgi güncelleme sırasında hata oluştu:", error);
      toast.error(
        error.response?.data || "Bilgiler güncellenirken bir hata oluştu."
      );
    }
  };

  return (
    <PassengerDashboardLayout>
      <Box sx={{ mt: 4, px: 2 }}>
        <Toaster position="top-right" reverseOrder={false} />
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Bilgilerim
          </Typography>
          {kullanici ? (
            <form onSubmit={handleSubmit}>
              <TextField
                name="telefon"
                label="Telefon Numarası"
                fullWidth
                margin="normal"
                value={formData.telefon}
                onChange={handleInputChange}
              />
              <TextField
                name="mevcutSifre"
                label="Mevcut Şifre"
                type="password"
                fullWidth
                margin="normal"
                value={formData.mevcutSifre}
                onChange={handleInputChange}
              />
              <TextField
                name="yeniSifre"
                label="Yeni Şifre"
                type="password"
                fullWidth
                margin="normal"
                value={formData.yeniSifre}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Bilgileri Güncelle
              </Button>
            </form>
          ) : (
            <Typography>Kullanıcı bilgileri yükleniyor...</Typography>
          )}
        </Paper>
      </Box>
    </PassengerDashboardLayout>
  );
};

export default Bilgilerim;
