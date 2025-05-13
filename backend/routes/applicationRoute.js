import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicant,
  getAppliedJobs,
  updateStatus,
} from "../controller/applicationController.js";

const router = express.Router();

router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicant);
router.post("/status/:id/update", isAuthenticated, updateStatus);

export default router;
