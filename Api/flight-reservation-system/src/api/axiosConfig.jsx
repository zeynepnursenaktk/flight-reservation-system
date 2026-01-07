import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44303/api", // API'nin base URL'si
});

export default api;
