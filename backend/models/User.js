const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["farmer", "worker"],
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: Number,
            default: 0
        },

        location: {
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            }
        },

        availability: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);