import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledStart: {
      type: Date,
      required: true,
    },

    scheduledEnd: {
      type: Date,
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
      min: 1,
    },

    creditsAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",

      ],
      default: "pending",
    },

    creditsTransferred: {
      type: Boolean,
      default: false,
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "accepted",
            "rejected",
            "cancelled",
            "completed",

          ],
          required: true,
        },

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        note: {
          type: String,
          default: "",
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({
  requesterId: 1,
  status: 1,
});

bookingSchema.index({
  providerId: 1,
  status: 1,
});

export default mongoose.model("Booking", bookingSchema);