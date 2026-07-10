import express from "express";

import {
  getReports,
  createReport,
  resolveReport,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/", getReports);

router.post("/", createReport);

router.put("/:id/resolve", resolveReport);

router.delete("/:id", deleteReport);

export default router;