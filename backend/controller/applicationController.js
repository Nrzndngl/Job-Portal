import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Job Id required", success: false });
    }
    // check if user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// get applied jobs
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });
    if (!application) {
      return res
        .status(404)
        .json({ message: "No applications found", success: false });
    }
    res.status(200).json({ application, success: true });
  } catch (error) {
    console.log(error);
  }
};

//get Applicant
export const getApplicant = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

// update Status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res
        .status(400)
        .json({ message: "Status required", success: false });
    }

    // find the application by applicant id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found", success: false });
    }

    // update  the status
    application.status = status.toLowerCase();
    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
