import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      bio,
      skills,
      location,
      phone,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: password,

      profile: {
        bio: bio || "",
        skills: Array.isArray(skills) ? skills : [],
        location: location || "",
        phone: phone || "",
        country: "",
        cityState: "",
        postalCode: "",
      },
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Account created successfully",
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        wallet: user.wallet,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account has been suspended",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        wallet: user.wallet,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// GET /api/auth/me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        wallet: user.wallet,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not load user information",
      error: error.message,
    });
  }
};

// PUT /api/auth/me
export const updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      fullName,
      email,
      bio,
      skills,
      location,
      phone,
      profileImage,
      country,
      cityState,
      postalCode,
    } = req.body;

    if (fullName !== undefined) {
      const trimmedName = fullName.trim();

      if (trimmedName.length < 2) {
        return res.status(400).json({
          message: "Full name must contain at least 2 characters",
        });
      }

      user.fullName = trimmedName;
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailExists = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (emailExists) {
        return res.status(409).json({
          message: "An account with this email already exists",
        });
      }

      user.email = normalizedEmail;
    }

    if (bio !== undefined) {
      user.profile.bio = bio.trim();
    }

    if (skills !== undefined) {
      user.profile.skills = Array.isArray(skills) ? skills : [];
    }

    if (location !== undefined) {
      user.profile.location = location.trim();
    }

    if (phone !== undefined) {
      user.profile.phone = phone.trim();
    }

    if (profileImage !== undefined) {
      user.profile.profileImage = profileImage.trim();
    }

    if (country !== undefined) {
      user.profile.country = country.trim();
    }

    if (cityState !== undefined) {
      user.profile.cityState = cityState.trim();
    }

    if (postalCode !== undefined) {
      user.profile.postalCode = postalCode.trim();
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        wallet: user.wallet,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not update profile",
      error: error.message,
    });
  }
};