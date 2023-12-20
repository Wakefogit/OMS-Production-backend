import express from "express";
import { csvDownload, pdfDownload, csvDashboardDownload } from "../controller/ExportController";

const router = express.Router();
router.post("/csv", csvDownload);
router.post("/pdf", pdfDownload);
router.post("/dashboard/csv", csvDashboardDownload);

export default router;