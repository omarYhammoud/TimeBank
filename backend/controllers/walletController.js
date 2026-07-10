import WalletTransaction from "../models/WalletTransaction.js";
import User from "../models/User.js";

export const getWalletSummary = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("wallet");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.wallet);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getWalletHistory = async (req, res) => {
  try {
    const history = await WalletTransaction.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const transferCredits = async (req, res) => {
  try {
    const {
      fromUserId,
      toUserId,
      bookingId,
      hours,
    } = req.body;

    const sender = await User.findById(fromUserId);
    const receiver = await User.findById(toUserId);

    if (!sender || !receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (sender.wallet.balanceHours < hours) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    sender.wallet.balanceHours -= hours;
    sender.wallet.totalSpent += hours;

    receiver.wallet.balanceHours += hours;
    receiver.wallet.totalEarned += hours;

    await sender.save();
    await receiver.save();

    await WalletTransaction.create({
      userId: sender._id,
      bookingId,
      type: "spend",
      direction: "debit",
      amountHours: hours,
      balanceAfter: sender.wallet.balanceHours,
      description: "Booking payment",
    });

    await WalletTransaction.create({
      userId: receiver._id,
      bookingId,
      type: "earn",
      direction: "credit",
      amountHours: hours,
      balanceAfter: receiver.wallet.balanceHours,
      description: "Booking earnings",
    });

    res.json({
      message: "Credits transferred successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};