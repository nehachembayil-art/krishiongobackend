const express = require("express");
const User = require("../models/User");
const Job = require("../models/Job");
const {
    calculateDistance,
    calculateMatchScore
} = require("../services/matchingService");
const router = express.Router();

// Find workers matching a job
router.get("/:jobId", async (req, res) => {
    try {

        // 1. Get the job
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // 2. Find all workers
        const workers = await User.find({
            role: "worker"
        });

        // 3. Match workers
       const matches = workers
    .filter(worker => {

        // Check skill
        const skillMatch = worker.skills.some(skill =>
            skill.toLowerCase() === job.workType.toLowerCase()
        );

        // Check availability
        const availabilityMatch =
            worker.availability.includes(job.date);

        return skillMatch && availabilityMatch;
    })
    .map(worker => {

    // Calculate distance
    const distance = calculateDistance(
        job.location.latitude,
        job.location.longitude,
        worker.location.latitude,
        worker.location.longitude
    );

    // Calculate match score
    const matchScore = calculateMatchScore(
        distance,
        worker.experience
    );

    console.log("MATCH SCORE:", matchScore);

    return {
        name: worker.name,
        skills: worker.skills,
        experience: worker.experience,
        distance: Number(distance.toFixed(2)),
        matchScore: matchScore
    };
})
.sort((a, b) => b.matchScore - a.matchScore);
        // 4. Return matched workers
        res.json({
    jobId: job._id,
    workType: job.workType,
    workersRequired: job.workersRequired,
    workersFound: matches.length,
    matches: matches
});

    } catch (error) {

        res.status(500).json({
            message: "Error finding matches",
            error: error.message
        });

    }
});

module.exports = router;