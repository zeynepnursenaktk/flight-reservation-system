import React from "react";
import PassengerDashboardLayout from "../../components/PassengerDashboardLayout";
import { Typography, Button, Box } from "@mui/material";

const PassengerDashboard = () => {
  return (
    <PassengerDashboardLayout>
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#1976d2",
          }}
        >
          Passenger Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: "24px",
            color: "#555",
          }}
        >
          Dashboard içerik alanı buraya gelir. Daha fazla özellik eklemek için
          geliştirmelere devam ediyoruz.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => alert("Daha Fazla Detay!")}
        >
          Daha Fazla Detay
        </Button>
      </Box>
    </PassengerDashboardLayout>
  );
};

export default PassengerDashboard;
