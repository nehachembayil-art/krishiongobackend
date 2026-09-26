const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const jobRoutes = require("./routes/jobRoutes");

const matchRoutes = require("./routes/matchRoutes");

const requestRoutes = require("./routes/requestRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
    res.send("🌱 KrishiOnGo Backend Running");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`KrishiOnGo server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });