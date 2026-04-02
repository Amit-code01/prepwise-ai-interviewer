import express from "express";
// Ensure the path and spelling are exactly 'reportController.js'
import { generateDetailedReport } from "../controllers/reportController.js"; 

const router = express.Router();

router.post("/generate-details", generateDetailedReport);

export default router;