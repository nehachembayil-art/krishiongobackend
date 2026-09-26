const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// Create a new farming job
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);

        const savedJob = await job.save();

        res.status(201).json(savedJob);

    } catch (error) {
        res.status(500).json({
            message: "Error creating job",
            error: error.message
        });
    }
});

// Get a job by ID
router.get("/:jobId", async (req, res) => {
    try {

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {

        res.status(500).json({
            message: "Error getting job",
            error: error.message
        });

    }
});

module.exports = router;