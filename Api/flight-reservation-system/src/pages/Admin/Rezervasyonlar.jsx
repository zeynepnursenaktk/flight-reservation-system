import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";

const Rezervasyonlar = () => {
  const [rezervasyonlar, setRezervasyonlar] = useState([]);  // Rezervasyon listesini tutmak için state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detay, setDetay] = useState(null); // Detay bilgisi
  const [open, setOpen] = useState(false); // Dialog açma durumu


  // Rezervasyon listesini API'den çekme fonksiyonu.
  const fetchRezervasyonlar = async () => {
    try {
      const response = await axios.get("/Admin/Rezervasyonlar");   // API'den rezervasyon listesini alıyoruz.
      setRezervasyonlar(response.data);                            // Rezervasyon listesini state'e kaydediyoruz.
    } catch (err) {
      console.error("Rezervasyonlar alınırken hata oluştu:", err);
      setError("Rezervasyonlar alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Rezervasyon detayını API'den çekme fonksiyonu.
  const fetchRezervasyonDetay = async (id) => {
    try {
      const response = await axios.get(`/Admin/RezervasyonDetay/${id}`);  // Belirtilen ID'ye ait rezervasyon detayını alıyoruz.
      setDetay(response.data);                                            // Detay bilgilerini state'e kaydediyoruz.
      setOpen(true);
    } catch (err) {
      console.error("Rezervasyon detayı alınırken hata oluştu:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDetay(null);
  };

  // Sayfa yüklendiğinde rezervasyon listesini çeker.
  useEffect(() => {
    fetchRezervasyonlar();
  }, []);

  return (
    <AdminDashboardLayout>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#3f51b5" }} 
        >
          Rezervasyonlar
        </Typography>
        {loading && <Typography>Yükleniyor...</Typography>}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rezervasyon ID</TableCell>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Uçuş</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Toplam Tutar</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rezervasyonlar.map((rezervasyon) => (
                  <TableRow key={rezervasyon.id}>
                    <TableCell>{rezervasyon.id}</TableCell>
                    <TableCell>{rezervasyon.kullaniciAdi}</TableCell>
                    <TableCell>{rezervasyon.ucusAdi}</TableCell>
                    <TableCell>
                      {new Date(rezervasyon.rezervasyonTarihi).toLocaleString()}
                    </TableCell>
                    <TableCell>{rezervasyon.toplamTutar} TL</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => fetchRezervasyonDetay(rezervasyon.id)}
                      >
                        Detay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Rezervasyon Detay Dialog */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Rezervasyon Detayı</DialogTitle>
          <DialogContent>
            {detay ? (
              <Box>
                <Typography><strong>Rezervasyon ID:</strong> {detay.id}</Typography>
                <Typography><strong>Kullanıcı:</strong> {detay.kullaniciAdi}</Typography>
                <Typography><strong>Uçuş:</strong> {detay.ucusAdi}</Typography>
                <Typography>
                  <strong>Rezervasyon Tarihi:</strong>{" "}
                  {new Date(detay.rezervasyonTarihi).toLocaleString()}
                </Typography>
                <Typography><strong>Toplam Tutar:</strong> {detay.toplamTutar} TL</Typography>
                <Typography><strong>Yetişkin Sayısı:</strong> {detay.yetiskinSayisi}</Typography>
                <Typography><strong>Çocuk Sayısı:</strong> {detay.cocukSayisi}</Typography>
                <Typography><strong>Bebek Sayısı:</strong> {detay.bebekSayisi}</Typography>
              </Box>
            ) : (
              <Typography>Detaylar yükleniyor...</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </AdminDashboardLayout>
  );
};

export default Rezervasyonlar;
