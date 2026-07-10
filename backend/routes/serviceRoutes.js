import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);

router.get("/search", searchServices);

router.get("/:id", getServiceById);

router.post("/", createService);

router.put("/:id", updateService);

router.delete("/:id", deleteService);

export default router;