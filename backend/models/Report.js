import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
    },

    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      actionTaken: String,

      resolvedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1 });

export default mongoose.model("Report", reportSchema);