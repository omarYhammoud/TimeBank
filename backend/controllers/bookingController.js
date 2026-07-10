import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("serviceId")
      .populate("providerId", "fullName")
      .populate("requesterId", "fullName")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("serviceId")
      .populate("providerId")
      .populate("requesterId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    if (service.providerId.toString() === requesterId) {
      return res.status(400).json({
        message: "You cannot book your own service.",
      });
    }

    const booking = await Booking.create({
      serviceId,
      requesterId,
      providerId: service.providerId,
      scheduledStart,
      scheduledEnd,
      durationHours,
      creditsAmount,

      statusHistory: [
        {
          status: "pending",
          changedBy: requesterId,
          note: "Booking created",
        },
      ],
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, changedBy, note } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = status;

    booking.statusHistory.push({
      status,
      changedBy,
      note,
    });

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};