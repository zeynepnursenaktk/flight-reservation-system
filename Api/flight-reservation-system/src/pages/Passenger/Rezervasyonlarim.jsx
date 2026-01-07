import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import { Toaster, toast } from "react-hot-toast";
import PassengerDashboardLayout from "../../components/PassengerDashboardLayout";

const Rezervasyonlarim = () => {
  const [rezervasyonlar, setRezervasyonlar] = useState([]);             // Kullanıcının rezervasyon listesini saklayan state.
  const [selectedRezervasyon, setSelectedRezervasyon] = useState(null); // Seçilen rezervasyon detaylarını saklayan state.
  const [detayModalOpen, setDetayModalOpen] = useState(false);

  const kullaniciBilgileri = JSON.parse(localStorage.getItem("kullaniciBilgileri")); // Kullanıcı bilgilerini localStorage'dan alıyoruz.


  // Kullanıcının rezervasyonlarını API'den çekmek için kullanılan fonksiyon.
  const fetchRezervasyonlar = async () => {
    try {
      const response = await axios.get("/Musteri/Rezervasyonlarim", {
        params: { userId: kullaniciBilgileri.kullaniciId },       // Kullanıcı ID'sini API'ye parametre olarak gönderiyoruz.
      });
      setRezervasyonlar(response.data);                           // Gelen rezervasyon verilerini state'e kaydediyoruz.
    } catch (error) {
      console.error("Rezervasyonlar alınırken hata oluştu:", error);
      toast.error("Rezervasyonlar yüklenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    fetchRezervasyonlar();
  }, []);

  const handleOpenDetayModal = (rezervasyon) => {
    setSelectedRezervasyon(rezervasyon);
    setDetayModalOpen(true);
  };

  const handleCloseDetayModal = () => {
    setSelectedRezervasyon(null);
    setDetayModalOpen(false);
  };


  // Rezervasyonu iptal etmek için kullanılan fonksiyon.
  const handleRezervasyonIptal = async (rezervasyonId) => {
    try { 
      await axios.post("/Musteri/RezervasyonIptal", { rezervasyonId }); // İptal işlemi için API isteği.
      toast.success("Rezervasyon başarıyla iptal edildi."); 
      fetchRezervasyonlar();                                            // Rezervasyon listesini güncelliyoruz.
    } catch (error) { 
      console.error("Rezervasyon iptali sırasında hata oluştu:", error);
      toast.error(
        error.response?.data?.Message || "Rezervasyon iptali sırasında bir hata oluştu."
      );
    }
  };

  return (
    <PassengerDashboardLayout>
      <Box
        sx={{
          mt: 4,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            backgroundColor: "#f5f5f5",
            width: "100%",
            maxWidth: "900px",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
            }}
          >
            Rezervasyonlarım
          </Typography>
        </Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {rezervasyonlar.length > 0 ? (
            rezervasyonlar.map((rezervasyon) => (
              <Paper
                key={rezervasyon.id}
                elevation={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 3,
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                <Box sx={{ flex: 1, marginRight: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#3f51b5",
                      marginBottom: 1,
                    }}
                  >
                    {rezervasyon.kalkisSehri} → {rezervasyon.varisSehri}
                  </Typography>
                  <Typography>
                    <strong>Kalkış Tarihi:</strong> {rezervasyon.kalkisTarihi}
                  </Typography>
                  <Typography>
                    <strong>Durum:</strong> {rezervasyon.durum}
                  </Typography>
                  <Typography>
                    <strong>Rezervasyon Tarihi:</strong>{" "}
                    {rezervasyon.rezervasyonTarihi}
                  </Typography>
                  <Typography>
                    <strong>Toplam Tutar:</strong>{" "}
                    <span style={{ color: "#4caf50" }}>
                      {rezervasyon.toplamTutar} TL
                    </span>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDetayModal(rezervasyon)}
                    sx={{
                      textTransform: "none",
                      padding: "10px 20px",
                    }}
                  >
                    Detaylar
                  </Button>
                  {rezervasyon.durum !== "İptal Edildi" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRezervasyonIptal(rezervasyon.id)}
                      sx={{
                        textTransform: "none",
                        padding: "10px 20px",
                        backgroundColor: "#f44336",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                      }}
                    >
                      İptal Et
                    </Button>
                  )}
                </Box>
              </Paper>
            ))
          ) : (
            <Typography textAlign="center" sx={{ mt: 2 }}>
              Hiç rezervasyonunuz bulunmamaktadır.
            </Typography>
          )}
        </Box>

        <Dialog open={detayModalOpen} onClose={handleCloseDetayModal}>
          <DialogTitle>Rezervasyon Detayları</DialogTitle>
          <DialogContent>
            {selectedRezervasyon ? (
              <>
                <Typography>
                  <strong>Kalkış Şehri:</strong> {selectedRezervasyon.kalkisSehri}
                </Typography>
                <Typography>
                  <strong>Varış Şehri:</strong> {selectedRezervasyon.varisSehri}
                </Typography>
                <Typography>
                  <strong>Kalkış Tarihi:</strong> {selectedRezervasyon.kalkisTarihi}
                </Typography>
                <Typography>
                  <strong>Durum:</strong> {selectedRezervasyon.durum}
                </Typography>
                <Typography>
                  <strong>Toplam Tutar:</strong> {selectedRezervasyon.toplamTutar} TL
                </Typography>
                <Typography>
                  <strong>Yetişkin Sayısı:</strong> {selectedRezervasyon.yetişkinSayisi}
                </Typography>
                <Typography>
                  <strong>Çocuk Sayısı:</strong> {selectedRezervasyon.cocukSayisi}
                </Typography>
                <Typography>
                  <strong>Bebek Sayısı:</strong> {selectedRezervasyon.bebekSayisi}
                </Typography>
              </>
            ) : (
              <Typography>Detaylar yüklenemedi.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetayModal}>Kapat</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PassengerDashboardLayout>
  );
};

export default Rezervasyonlarim;
