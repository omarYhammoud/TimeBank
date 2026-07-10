import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    type: {
      type: String,
      enum: ["earn", "spend", "refund", "adjustment"],
      required: true,
    },

    direction: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amountHours: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

walletTransactionSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);