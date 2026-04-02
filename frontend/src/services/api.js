import axios from "axios";

const API = axios.create({

  baseURL: "https://prepwise-ai-backend-2ctd.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  }
});

export default API;