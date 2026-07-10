import Report from "../models/Report.js";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporterId", "fullName")
      .populate("reportedUserId", "fullName")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { resolvedBy, actionTaken, status } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = status;

    report.resolution = {
      resolvedBy,
      actionTaken,
      resolvedAt: new Date(),
    };

    await report.save();

    res.json(report);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    await report.deleteOne();

    res.json({
      message: "Report deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};