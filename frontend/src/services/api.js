import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://prepwise-ai-backend-2ctd.onrender.com"
});

export default API;