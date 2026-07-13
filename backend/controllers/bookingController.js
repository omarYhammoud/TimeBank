import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

const allowedStatuses = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "completed",
  "disputed",
];

const populateBooking = (query) => {
  return query
    .populate("serviceId")
    .populate("providerId", "fullName email")
    .populate("requesterId", "fullName email");
};

/**
 * GET /api/bookings
 * GET /api/bookings?userId=USER_ID
 */
export const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    const filter = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: "Invalid user ID.",
        });
      }

      filter.$or = [
        { providerId: userId },
        { requesterId: userId },
      ];
    }

    const bookings = await populateBooking(
      Booking.find(filter)
    ).sort({
      scheduledStart: 1,
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: error.message || "Failed to retrieve bookings.",
    });
  }
};

/**
 * GET /api/bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await populateBooking(
      Booking.findById(id)
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);

    res.status(500).json({
      message: error.message || "Failed to retrieve booking.",
    });
  }
};

/**
 * POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      requesterId,
      scheduledStart,
      scheduledEnd,
      durationHours,
      creditsAmount,
    } = req.body;

    if (
      !serviceId ||
      !requesterId ||
      !scheduledStart ||
      !scheduledEnd ||
      !durationHours ||
      !creditsAmount
    ) {
      return res.status(400).json({
        message: "All booking fields are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        message: "Invalid service ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requesterId)) {
      return res.status(400).json({
        message: "Invalid requester ID.",
      });
    }

    const startDate = new Date(scheduledStart);
    const endDate = new Date(scheduledEnd);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid booking date.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        message: "The booking end time must be after its start time.",
      });
    }

    if (Number(durationHours) < 1) {
      return res.status(400).json({
        message: "Duration must be at least one hour.",
      });
    }

    if (Number(creditsAmount) < 1) {
      return res.status(400).json({
        message: "Credits amount must be at least one.",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    if (!service.providerId) {
      return res.status(400).json({
        message: "This service does not have a provider.",
      });
    }

    if (
      service.providerId.toString() === requesterId.toString()
    ) {
      return res.status(400).json({
        message: "You cannot book your own service.",
      });
    }

    const booking = await Booking.create({
      serviceId,
      requesterId,
      providerId: service.providerId,
      scheduledStart: startDate,
      scheduledEnd: endDate,
      durationHours: Number(durationHours),
      creditsAmount: Number(creditsAmount),
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          changedBy: requesterId,
          note: "Booking created.",
        },
      ],
    });

    const populatedBooking = await populateBooking(
      Booking.findById(booking._id)
    );

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: error.message || "Failed to create booking.",
    });
  }
};

/**
 * PUT /api/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, changedBy, note = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status.",
      });
    }

    if (
      !changedBy ||
      !mongoose.Types.ObjectId.isValid(changedBy)
    ) {
      return res.status(400).json({
        message: "A valid changedBy user ID is required.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    const isProvider =
      booking.providerId.toString() === changedBy.toString();

    const isRequester =
      booking.requesterId.toString() === changedBy.toString();

    if (!isProvider && !isRequester) {
      return res.status(403).json({
        message: "You are not part of this booking.",
      });
    }

    if (booking.status === status) {
      return res.status(400).json({
        message: `Booking is already ${status}.`,
      });
    }

    if (status === "accepted") {
      if (!isProvider) {
        return res.status(403).json({
          message: "Only the provider can accept this booking.",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          message: "Only pending bookings can be accepted.",
        });
      }
    }

    if (status === "rejected") {
      if (!isProvider) {
        return res.status(403).json({
          message: "Only the provider can reject this booking.",
        });
      }

      if (booking.status !== "pending") {
        return res.status(400).json({
          message: "Only pending bookings can be rejected.",
        });
      }
    }

    if (status === "completed") {
      if (!isProvider) {
        return res.status(403).json({
          message: "Only the provider can complete this booking.",
        });
      }

      if (booking.status !== "accepted") {
        return res.status(400).json({
          message: "Only accepted bookings can be completed.",
        });
      }
    }

    if (status === "cancelled") {
      if (!isRequester) {
        return res.status(403).json({
          message: "Only the requester can cancel this booking.",
        });
      }

      if (!["pending", "accepted"].includes(booking.status)) {
        return res.status(400).json({
          message:
            "Only pending or accepted bookings can be cancelled.",
        });
      }
    }

    if (status === "disputed") {
      if (!["accepted", "completed"].includes(booking.status)) {
        return res.status(400).json({
          message:
            "Only accepted or completed bookings can be disputed.",
        });
      }
    }

    booking.status = status;

    booking.statusHistory.push({
      status,
      changedBy,
      note: note.trim(),
      changedAt: new Date(),
    });

    await booking.save();

    const updatedBooking = await populateBooking(
      Booking.findById(booking._id)
    );

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to update booking status.",
    });
  }
};

/**
 * DELETE /api/bookings/:id
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    res.status(500).json({
      message: error.message || "Failed to delete booking.",
    });
  }
};