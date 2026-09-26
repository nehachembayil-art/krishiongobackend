const express = require("express");
const WorkRequest = require("../models/WorkRequest");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();

// Farmer sends a work request to a worker
router.post("/", async (req, res) => {
    try {

        const { jobId, farmerId, workerId } = req.body;

        // Check job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check farmer
        const farmer = await User.findById(farmerId);

        if (!farmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        // Check worker
        const worker = await User.findById(workerId);

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            });
        }

        // Create request
        const request = await WorkRequest.create({
            jobId,
            farmerId,
            workerId,
            status: "pending"
        });

        res.status(201).json({
            message: "Work request sent successfully",
            request: request
        });

    } catch (error) {

        res.status(500).json({
            message: "Error sending work request",
            error: error.message
        });

    }
});

// Get work requests for a worker
router.get("/worker/:workerId", async (req, res) => {
    try {

        const requests = await WorkRequest.find({
    workerId: req.params.workerId
})
.populate("jobId")
.populate("farmerId", "name phone email")
.populate("workerId", "name phone email");
        res.json({
            workerId: req.params.workerId,
            requests: requests
        });

    } catch (error) {

        res.status(500).json({
            message: "Error getting worker requests",
            error: error.message
        });

    }
});

// Accept or reject a work request
router.patch("/:requestId", async (req, res) => {
    try {

        const { status } = req.body;

        // Check valid status
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        // Find request
        const request = await WorkRequest.findById(
            req.params.requestId
        );

        if (!request) {
            return res.status(404).json({
                message: "Work request not found"
            });
        }

        // Update request status
        request.status = status;
        await request.save();

        // If worker accepted the request
        if (status === "accepted") {

            // Find the job
            const job = await Job.findById(request.jobId);

            if (job) {

                // Count accepted workers
                const acceptedWorkers = await WorkRequest.countDocuments({
                    jobId: request.jobId,
                    status: "accepted"
                });

                // If enough workers accepted
                if (acceptedWorkers >= job.workersRequired) {
                    job.status = "filled";
                    await job.save();
                }
            }
        }

        res.json({
            message: `Work request ${status} successfully`,
            request: request
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating work request",
            error: error.message
        });

    }
});

module.exports = router;