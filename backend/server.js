import dotenv from "dotenv";
dotenv.config(); // ✅ Initialize environment variables first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import Routes
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// 🔥 Environment Validation
const requiredVars = ["MONGO_URI", "GROQ_API_KEY"];
requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing Required Environment Variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🩺 Basic Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Prepwise AI Backend is running 🚀" });
});

// API Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/report", reportRoutes);

// 🚨 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Database Connection & Server Start
mongoose.set('strictQuery', false); // Prepare for Mongoose 7+ changes
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📂 MongoDB Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is officially live on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });