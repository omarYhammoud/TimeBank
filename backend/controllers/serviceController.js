import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("providerId", "fullName profile.ratingAverage")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("providerId")
      .populate("categoryId");

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      providerId,
      categoryId,
      title,
      description,
      locationType,
      estimatedDurationHours,
    } = req.body;

    const service = await Service.create({
      providerId,
      categoryId,
      title,
      description,
      locationType,
      estimatedDurationHours,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const searchServices = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const services = await Service.find({
      $text: {
        $search: keyword,
      },
    })
      .populate("providerId", "fullName")
      .populate("categoryId", "name");

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};