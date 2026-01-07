import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import { Toaster, toast } from "react-hot-toast";
import PassengerDashboardLayout from "../../components/PassengerDashboardLayout";

const UcusAra = () => {
  const [searchTerm, setSearchTerm] = useState("");   // Arama terimini saklayan state.
  const [ucuslar, setUcuslar] = useState([]);         // Arama sonuçlarını saklayan state.
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUcus, setSelectedUcus] = useState(null);   // Seçilen uçuşun bilgilerini saklayan state.

  const [ucusSiniflari, setUcusSiniflari] = useState([]);   // Uçuş sınıflarını saklayan state.
  const [rezervasyonBilgileri, setRezervasyonBilgileri] = useState({
    UcusSinifId: "",
    YetiskinSayisi: 1,
    CocukSayisi: 0,
    BebekSayisi: 0,
    AdSoyadListesi: [],
  });

  const kullaniciBilgileri = JSON.parse(localStorage.getItem("kullaniciBilgileri"));  // Kullanıcı bilgilerini localStorage'dan alıyoruz.


  // Uçuş sınıflarını API'den çekmek için kullanılan useEffect.
  useEffect(() => {
    const fetchUcusSiniflari = async () => {
      try {
        const response = await axios.get("/Musteri/UcusSiniflari");
        setUcusSiniflari(response.data);
      } catch (error) {
        toast.error("Uçuş sınıfları yüklenirken bir hata oluştu.");
      }
    };
    fetchUcusSiniflari();
  }, []);


  // Uçuş arama işlemi.
  const handleUcusArama = async () => {
    setError(null);
    setLoading(true);
    if (!searchTerm.trim()) {
      setError("Lütfen bir şehir adı girin");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "/Musteri/DinamikUcusAra",
        { searchTerm },                    // Arama terimini API'ye gönderiyoruz.
        { headers: { "Content-Type": "application/json" } }
      );
      setUcuslar(response.data);          // Gelen uçuşları state'e kaydediyoruz.
      if (response.data.length === 0) {
        toast.error("Uçuş bulunamadı.");
      } else {
        toast.success("Uçuşlar başarıyla yüklendi!");
      }
    } catch (error) {
      setError("Uçuş arama sırasında bir hata oluştu.");
      toast.error("Uçuş arama sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ucus) => {
    setSelectedUcus(ucus);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedUcus(null);
    setRezervasyonBilgileri({
      ...rezervasyonBilgileri,    // Rezervasyon bilgilerini sıfırlıyoruz.
      UcusSinifId: "",
      YetiskinSayisi: 1,
      CocukSayisi: 0,
      BebekSayisi: 0,
      AdSoyadListesi: [],
    });
  };

  // Rezervasyon bilgilerini güncellemek için kullanılan fonksiyon.
  const handleRezervasyonBilgileriDegisimi = (field, value) => {
    setRezervasyonBilgileri((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Yolcu isimleri için alan oluşturma fonksiyonu.
  const handleAdSoyadOlustur = () => {
    const toplamYolcu =
      parseInt(rezervasyonBilgileri.YetiskinSayisi || 0) +
      parseInt(rezervasyonBilgileri.CocukSayisi || 0) +
      parseInt(rezervasyonBilgileri.BebekSayisi || 0);

    const adSoyadListesi = Array.from({ length: toplamYolcu }, () => "");
    setRezervasyonBilgileri((prev) => ({
      ...prev,
      AdSoyadListesi: adSoyadListesi,
    }));
  };

  // Yolcu isimlerini güncelleme fonksiyonu.
  const handleAdSoyadDegisimi = (index, value) => {
    const yeniAdSoyadListesi = [...rezervasyonBilgileri.AdSoyadListesi];
    yeniAdSoyadListesi[index] = value;
    setRezervasyonBilgileri((prev) => ({
      ...prev,
      AdSoyadListesi: yeniAdSoyadListesi,
    }));
  };

  // Rezervasyon yapma işlemi.
  const handleRezervasyonYap = async () => {
    if (!rezervasyonBilgileri.UcusSinifId) {
      toast.error("Lütfen uçuş sınıfını seçin.");
      return;
    }

    try {
      const rezervasyonData = {
        KullaniciId: parseInt(kullaniciBilgileri?.kullaniciId),
        UcusId: parseInt(selectedUcus?.id),
        UcusSinifId: parseInt(rezervasyonBilgileri.UcusSinifId),
        YetiskinSayisi: parseInt(rezervasyonBilgileri.YetiskinSayisi),
        CocukSayisi: parseInt(rezervasyonBilgileri.CocukSayisi),
        BebekSayisi: parseInt(rezervasyonBilgileri.BebekSayisi),
        AdSoyadListesi: rezervasyonBilgileri.AdSoyadListesi.map((yolcu) => yolcu.trim()),
      };

      console.log("Gönderilen Rezervasyon Verisi:", rezervasyonData);

      const response = await axios.post(
        "/Musteri/RezervasyonYap",
        rezervasyonData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.Message || "Rezervasyon başarıyla tamamlandı.");
      handleCloseModal();
    } catch (error) {
      console.error("Rezervasyon  sırasında hata oluştu:", error);
      toast.error(
        error.response?.data?.Message || "Boş koltuk bulunmamaktadır."
      );
    }
  };


  return (
    <PassengerDashboardLayout>
      <Toaster position="top-right" reverseOrder={false} />
      <Box sx={{ padding: 4, maxWidth: "800px", margin: "0 auto" }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Uçuş Ara
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Şehir Ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              placeholder="Kalkış veya varış şehri girin..."
            />
            <Button variant="contained" onClick={handleUcusArama}>
              Uçuş Ara
            </Button>
          </Box>
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
      <Box sx={{ padding: 4, maxWidth: "800px", margin: "0 auto", height: "60vh", overflowY: "auto" }}>
        {loading ? (
          <Typography textAlign="center" sx={{ mt: 4 }}>
            Uçuşlar yükleniyor...
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Kalkış - Varış</strong></TableCell>
                  <TableCell><strong>Kalkış Tarihi</strong></TableCell>
                  <TableCell><strong>Fiyat</strong></TableCell>
                  <TableCell><strong>Rezervasyon</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ucuslar.map((ucus, index) => (
                  <TableRow key={index}>
                    <TableCell>{ucus.kalkisSehri} - {ucus.varisSehri}</TableCell>
                    <TableCell>{ucus.kalkisTarihi}</TableCell>
                    <TableCell>{ucus.fiyat} TL</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleOpenModal(ucus)}>
                        Rezervasyon Yap
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Rezervasyon Yap</DialogTitle>
        <DialogContent>
          {selectedUcus && (
            <Box>
              <Typography><strong>Kalkış - Varış:</strong> {selectedUcus.kalkisSehri} - {selectedUcus.varisSehri}</Typography>
              <Typography><strong>Kalkış Tarihi:</strong> {selectedUcus.kalkisTarihi}</Typography>
              <Typography><strong>Fiyat:</strong> {selectedUcus.fiyat} TL</Typography>
              <Select
                fullWidth
                value={rezervasyonBilgileri.UcusSinifId}
                onChange={(e) => handleRezervasyonBilgileriDegisimi("UcusSinifId", e.target.value)}
                displayEmpty
                margin="normal"
              >
                <MenuItem value="" disabled>Uçuş Sınıfı Seçin</MenuItem>
                {ucusSiniflari.map((sinif) => (
                  <MenuItem key={sinif.id} value={sinif.id}>
                    {sinif.ad} - {sinif.fiyat} TL
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Yetişkin Sayısı"
                type="number"
                fullWidth
                margin="normal"
                value={rezervasyonBilgileri.YetiskinSayisi}
                onChange={(e) => handleRezervasyonBilgileriDegisimi("YetiskinSayisi", e.target.value)}
              />
              <TextField
                label="Çocuk Sayısı"
                type="number"
                fullWidth
                margin="normal"
                value={rezervasyonBilgileri.CocukSayisi}
                onChange={(e) => handleRezervasyonBilgileriDegisimi("CocukSayisi", e.target.value)}
              />
              <TextField
                label="Bebek Sayısı"
                type="number"
                fullWidth
                margin="normal"
                value={rezervasyonBilgileri.BebekSayisi}
                onChange={(e) => handleRezervasyonBilgileriDegisimi("BebekSayisi", e.target.value)}
              />
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleAdSoyadOlustur}
              >
                Ad-Soyad Bilgilerini Gir
              </Button>
              {rezervasyonBilgileri.AdSoyadListesi.map((adSoyad, index) => (
                <TextField
                  key={index}
                  label={`Ad Soyad - Yolcu ${index + 1}`}
                  value={adSoyad}
                  onChange={(e) => handleAdSoyadDegisimi(index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">İptal</Button>
          <Button onClick={handleRezervasyonYap} variant="contained" color="primary">Rezervasyonu Onayla</Button>
        </DialogActions>
      </Dialog>
    </PassengerDashboardLayout>
  );
};

export default UcusAra;
