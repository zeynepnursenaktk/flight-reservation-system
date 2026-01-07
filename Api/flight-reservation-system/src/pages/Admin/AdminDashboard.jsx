import React from "react";
import AdminDashboardLayout from "../../components/AdminDashboardLayout";
import { Box, Typography, Paper } from "@mui/material";

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
          Admin Dashboard
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "900px",
            padding: 4,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Yönetim Paneli
          </Typography>
          <Typography>
            Bu alandan sistemin yönetim işlevlerine erişebilirsiniz. 
            Yolcu rezervasyonlarını yönetebilir, uçuş bilgilerini düzenleyebilir 
            ve kullanıcı bilgilerini kontrol edebilirsiniz.
          </Typography>
        </Paper>
      </Box>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
