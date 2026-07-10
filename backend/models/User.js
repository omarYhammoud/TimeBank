import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must contain at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["member", "moderator", "admin"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "active",
    },

    profile: {
      bio: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },

      skills: {
        type: [String],
        default: [],
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      profileImage: {
        type: String,
        default: "",
      },

      ratingAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      completedServices: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    wallet: {
      balanceHours: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalEarned: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalSpent: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Explicit unique index recommended by your database design.


// Hash the password before saving a new user or changed password.
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Compare the entered password with the encrypted password.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;