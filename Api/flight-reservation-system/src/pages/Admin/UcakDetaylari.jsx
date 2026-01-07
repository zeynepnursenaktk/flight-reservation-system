import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";

const UcakDetaylari = () => {
  const [ucaklar, setUcaklar] = useState([]);              // Uçak listesini tutmak için state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUcak, setSelectedUcak] = useState(null);  // Düzenlenecek uçak bilgilerini tutan state.
  const [updatedData, setUpdatedData] = useState({         // Düzenlenmiş verileri tutan state.
    kalkisSehri: "",
    varisSehri: "",
    kalkisTarihi: "",
    fiyat: "",
    bosKoltukSayisi: "",
  });

  // Uçak listesini API'den çekmek için fonksiyon.
  const fetchUcaklar = async () => {
    try {
      const response = await axios.get("/Admin/UcakDetaylari"); // API'ye GET isteği gönderiyoruz.
      setUcaklar(response.data);                                // Gelen veriyi state'e kaydediyoruz.
    } catch (err) {
      console.error("Uçak detayları alınırken hata oluştu:", err);
      setError("Uçak detayları alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };


  // Belirtilen uçak ID'sine göre silme işlemi yapan fonksiyon.
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/Admin/SilVeOnayla/${id}`);           // API'ye DELETE isteği gönderiyoruz.
      setUcaklar(ucaklar.filter((ucak) => ucak.id !== id));     // Silinen uçağı listeden kaldırıyoruz.
    } catch (err) {
      console.error("Silme işlemi başarısız:", err);
      alert("Uçak silinemedi.");
    }
  };


  // Düzenleme modalını açan ve seçilen uçak bilgilerini düzenleme formuna dolduran fonksiyon.
  const handleEditOpen = (ucak) => {
    setSelectedUcak(ucak);              // Düzenlenecek uçağı seçiyoruz.
    setUpdatedData({
      kalkisSehri: ucak.kalkisSehri,
      varisSehri: ucak.varisSehri,
      kalkisTarihi: new Date(ucak.kalkisTarihi).toISOString().slice(0, 16),
      fiyat: ucak.fiyat,
      bosKoltukSayisi: ucak.bosKoltukSayisi,
    });
    setEditModalOpen(true);
  };

  // Düzenleme modalını kapatan fonksiyon.
  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedUcak(null);
  };

  // Düzenlenmiş uçak bilgilerini kaydetmek için API'ye istek gönderen fonksiyon.
  const handleEditSave = async () => {
    try {
      await axios.put(`/Admin/UcusDuzenle/${selectedUcak.id}`, {  // API'ye PUT isteği gönderiyoruz.
        ...selectedUcak,
        kalkisSehri: updatedData.kalkisSehri,
        varisSehri: updatedData.varisSehri,
        kalkisTarihi: new Date(updatedData.kalkisTarihi).toISOString(),
        fiyat: updatedData.fiyat,
        bosKoltukSayisi: updatedData.bosKoltukSayisi,
      });
      fetchUcaklar();                                            // Uçak listesini güncelliyoruz.
      handleEditClose();
    } catch (err) {
      console.error("Düzenleme işlemi başarısız:", err);
      alert("Uçak düzenlenemedi.");
    }
  };

  // Sayfa yüklendiğinde uçak listesini çeker.
  useEffect(() => {
    fetchUcaklar();
  }, []);

  return (
    <AdminDashboardLayout>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#3f51b5" }} 
        >
          Uçak Detayları
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
                  <TableCell>Kalkış Şehri</TableCell>
                  <TableCell>Varış Şehri</TableCell>
                  <TableCell>Kalkış Tarihi</TableCell>
                  <TableCell>Fiyat</TableCell>
                  <TableCell>Boş Koltuk Sayısı</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ucaklar.map((ucak) => (
                  <TableRow key={ucak.id}>
                    <TableCell>{ucak.kalkisSehri}</TableCell>
                    <TableCell>{ucak.varisSehri}</TableCell>
                    <TableCell>
                      {new Date(ucak.kalkisTarihi).toLocaleString()}
                    </TableCell>
                    <TableCell>{ucak.fiyat} TL</TableCell>
                    <TableCell>{ucak.bosKoltukSayisi}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditOpen(ucak)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(ucak.id)}
                      >
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Düzenleme Modalı */}
        <Dialog open={editModalOpen} onClose={handleEditClose}>
          <DialogTitle>Uçuş Düzenle</DialogTitle>
          <DialogContent>
            <TextField
              label="Kalkış Şehri"
              fullWidth
              margin="normal"
              value={updatedData.kalkisSehri}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, kalkisSehri: e.target.value })
              }
            />
            <TextField
              label="Varış Şehri"
              fullWidth
              margin="normal"
              value={updatedData.varisSehri}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, varisSehri: e.target.value })
              }
            />
            <TextField
              label="Kalkış Tarihi"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={updatedData.kalkisTarihi}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, kalkisTarihi: e.target.value })
              }
            />
            <TextField
              label="Fiyat"
              type="number"
              fullWidth
              margin="normal"
              value={updatedData.fiyat}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, fiyat: e.target.value })
              }
            />
            <TextField
              label="Boş Koltuk Sayısı"
              type="number"
              fullWidth
              margin="normal"
              value={updatedData.bosKoltukSayisi}
              onChange={(e) =>
                setUpdatedData({
                  ...updatedData,
                  bosKoltukSayisi: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>İptal</Button>
            <Button variant="contained" color="primary" onClick={handleEditSave}>
              Kaydet
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminDashboardLayout>
  );
};

export default UcakDetaylari;
