import express from "express";

import {
  getWalletSummary,
  getWalletHistory,
  transferCredits,
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/:userId", getWalletSummary);

router.get("/:userId/history", getWalletHistory);

router.post("/transfer", transferCredits);

export default router;