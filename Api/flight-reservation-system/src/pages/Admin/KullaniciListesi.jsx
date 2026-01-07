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
    DialogActions,
} from "@mui/material";
import axios from "../../api/axiosConfig";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";

const KullaniciListesi = () => {
    const [kullanicilar, setKullanicilar] = useState([]);   // Kullanıcı listesini tutmak için state.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); 
    const [selectedKullaniciId, setSelectedKullaniciId] = useState(null);

    // Kullanıcı listesini API'den çek
    const fetchKullanicilar = async () => {
        try {
            const response = await axios.get("/Admin/KullaniciListesi"); // API'den kullanıcı listesini alıyoruz.
            setKullanicilar(response.data);                              // Kullanıcı listesini state'e kaydediyoruz.
        } catch (err) {
            console.error("Kullanıcılar alınırken hata oluştu:", err);
            setError("Kullanıcılar alınırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Kullanıcı silme işlemi
    const handleKullaniciSil = async () => {
        try {
            await axios.delete(`/Admin/KullaniciSil/${selectedKullaniciId}`);     // API üzerinden silme isteği gönderiyoruz.
            setKullanicilar((prev) =>
                prev.filter((kullanici) => kullanici.id !== selectedKullaniciId)  // Silinen kullanıcıyı listeden çıkarıyoruz.
            );
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error("Kullanıcı silme işlemi başarısız:", err);
            setError("Kullanıcı silinirken bir hata oluştu.");
        }
    };

    // Sayfa yüklendiğinde kullanıcı listesini çeker.
    useEffect(() => {
        fetchKullanicilar();
    }, []);

    return (
        <AdminDashboardLayout>
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: "#3f51b5" }} 
                >
                    Kullanıcı Listesi
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
                                    <TableCell>Kullanıcı ID</TableCell>
                                    <TableCell>Ad Soyad</TableCell>
                                    <TableCell>E-posta</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell>İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {kullanicilar.map((kullanici) => (
                                    <TableRow key={kullanici.id}>
                                        <TableCell>{kullanici.id}</TableCell>
                                        <TableCell>{kullanici.ad + " " + kullanici.soyad}</TableCell>
                                        <TableCell>{kullanici.eposta}</TableCell>
                                        <TableCell>{kullanici.telefon}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedKullaniciId(kullanici.id); // Silinecek kullanıcı ID'sini belirliyoruz.
                                                    setDeleteDialogOpen(true);
                                                }}
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

                {/* Silme Onay Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Kullanıcı Sil</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri
                            alınamaz.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            variant="outlined"
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={handleKullaniciSil}
                            variant="contained"
                            color="error"
                        >
                            Sil
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminDashboardLayout>
    );
};

export default KullaniciListesi;
