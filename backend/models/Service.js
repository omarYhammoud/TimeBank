import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    locationType: {
      type: String,
      enum: ["online", "in_person", "both"],
      default: "both",
    },

    estimatedDurationHours: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "active", "inactive", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ providerId: 1 });

serviceSchema.index({ categoryId: 1, status: 1 });

serviceSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Service", serviceSchema);