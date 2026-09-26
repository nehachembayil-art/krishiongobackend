const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        workType: {
            type: String,
            required: true,
            trim: true
        },

        workersRequired: {
            type: Number,
            required: true,
            min: 1
        },

        date: {
            type: String,
            required: true
        },

        duration: {
            type: String,
            default: "1 day"
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },

        status: {
            type: String,
            enum: ["open", "filled", "cancelled"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);