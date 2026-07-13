import mongoose from "mongoose";
import Service from "../models/Service.js";
import Category from "../models/Category.js";

const locationTypes = ["online", "in_person", "both"];
const serviceStatuses = [
  "pending",
  "active",
  "inactive",
  "rejected",
];

const populateService = (query) => {
  return query
    .populate(
      "providerId",
      "fullName email profile.ratingAverage"
    )
    .populate("categoryId", "name description status");
};

/**
 * GET /api/services
 *
 * Get services.
 *
 * Optional queries:
 * /api/services?status=active
 * /api/services?categoryId=...
 * /api/services?excludeProviderId=...
 */
export const getServices = async (req, res) => {
  try {
    const {
      status,
      categoryId,
      excludeProviderId,
    } = req.query;

    const filter = {};

    if (status) {
      if (!serviceStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid service status.",
        });
      }

      filter.status = status;
    }

    if (categoryId) {
      if (
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return res.status(400).json({
          message: "Invalid category ID.",
        });
      }

      filter.categoryId = categoryId;
    }

    if (excludeProviderId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          excludeProviderId
        )
      ) {
        return res.status(400).json({
          message: "Invalid provider ID.",
        });
      }

      filter.providerId = {
        $ne: excludeProviderId,
      };
    }

    const services = await populateService(
      Service.find(filter)
    ).sort({
      createdAt: -1,
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to retrieve services.",
    });
  }
};

/**
 * GET /api/services/my?userId=USER_ID
 */
export const getMyServices = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const services = await populateService(
      Service.find({
        providerId: userId,
      })
    ).sort({
      createdAt: -1,
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Get my services error:", error);

    res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve your services.",
    });
  }
};

/**
 * GET /api/services/search?keyword=react
 */
export const searchServices = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";

    if (!keyword) {
      return res.status(200).json([]);
    }

    const services = await populateService(
      Service.find({
        status: "active",
        $text: {
          $search: keyword,
        },
      })
    );

    res.status(200).json(services);
  } catch (error) {
    console.error("Search services error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to search services.",
    });
  }
};

/**
 * GET /api/services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid service ID.",
      });
    }

    const service = await populateService(
      Service.findById(id)
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to retrieve service.",
    });
  }
};

/**
 * POST /api/services
 */
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

    if (
      !providerId ||
      !categoryId ||
      !title?.trim() ||
      !description?.trim() ||
      !estimatedDurationHours
    ) {
      return res.status(400).json({
        message: "All service fields are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(providerId)
    ) {
      return res.status(400).json({
        message: "Invalid provider ID.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(categoryId)
    ) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    if (
      locationType &&
      !locationTypes.includes(locationType)
    ) {
      return res.status(400).json({
        message: "Invalid location type.",
      });
    }

    const duration = Number(
      estimatedDurationHours
    );

    if (!Number.isFinite(duration) || duration < 1) {
      return res.status(400).json({
        message:
          "Estimated duration must be at least one hour.",
      });
    }

    const category = await Category.findById(
      categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    if (category.status !== "active") {
      return res.status(400).json({
        message:
          "You cannot create a service in an inactive category.",
      });
    }

    const service = await Service.create({
      providerId,
      categoryId,
      title: title.trim(),
      description: description.trim(),
      locationType: locationType || "both",
      estimatedDurationHours: duration,

      /*
       * Change this to "pending" when services
       * must be approved by an administrator.
       */
      status: "active",
    });

    const populatedService = await populateService(
      Service.findById(service._id)
    );

    res.status(201).json(populatedService);
  } catch (error) {
    console.error("Create service error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A duplicate service was detected.",
      });
    }

    res.status(500).json({
      message:
        error.message || "Failed to create service.",
    });
  }
};

/**
 * PUT /api/services/:id
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      providerId,
      categoryId,
      title,
      description,
      locationType,
      estimatedDurationHours,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid service ID.",
      });
    }

    if (
      !providerId ||
      !mongoose.Types.ObjectId.isValid(providerId)
    ) {
      return res.status(400).json({
        message: "A valid provider ID is required.",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    if (
      service.providerId.toString() !==
      providerId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to edit this service.",
      });
    }

    if (categoryId) {
      if (
        !mongoose.Types.ObjectId.isValid(categoryId)
      ) {
        return res.status(400).json({
          message: "Invalid category ID.",
        });
      }

      const category = await Category.findById(
        categoryId
      );

      if (!category) {
        return res.status(404).json({
          message: "Category not found.",
        });
      }

      service.categoryId = categoryId;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Service title cannot be empty.",
        });
      }

      service.title = title.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          message:
            "Service description cannot be empty.",
        });
      }

      service.description = description.trim();
    }

    if (locationType !== undefined) {
      if (!locationTypes.includes(locationType)) {
        return res.status(400).json({
          message: "Invalid location type.",
        });
      }

      service.locationType = locationType;
    }

    if (estimatedDurationHours !== undefined) {
      const duration = Number(
        estimatedDurationHours
      );

      if (
        !Number.isFinite(duration) ||
        duration < 1
      ) {
        return res.status(400).json({
          message:
            "Estimated duration must be at least one hour.",
        });
      }

      service.estimatedDurationHours = duration;
    }

    if (status !== undefined) {
      if (!serviceStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid service status.",
        });
      }

      service.status = status;
    }

    await service.save();

    const updatedService = await populateService(
      Service.findById(service._id)
    );

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to update service.",
    });
  }
};

/**
 * DELETE /api/services/:id?userId=USER_ID
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid service ID.",
      });
    }

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "A valid user ID is required.",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    if (
      service.providerId.toString() !==
      userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this service.",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to delete service.",
    });
  }
};