import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Report from "../models/Report.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeServices = await Service.countDocuments({
      status: "active",
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const openReports = await Report.countDocuments({
      status: "open",
    });

    const totalHours = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$creditsAmount",
          },
        },
      },
    ]);

    res.json({
      totalUsers,
      activeServices,
      completedBookings,
      openReports,
      totalHoursExchanged:
        totalHours.length > 0 ? totalHours[0].total : 0,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-passwordHash");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const suspendUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "suspended",
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User suspended successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const activateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "active",
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User activated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getAllServices = async (req, res) => {

  try {

    const services = await Service.find()
      .populate("providerId", "fullName")
      .populate("categoryId", "name");

    res.json(services);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getAllBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("requesterId", "fullName")
      .populate("providerId", "fullName")
      .populate("serviceId", "title");

    res.json(bookings);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const getAllReports = async (req, res) => {

  try {

    const reports = await Report.find()
      .populate("reporterId", "fullName")
      .populate("reportedUserId", "fullName");

    res.json(reports);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};