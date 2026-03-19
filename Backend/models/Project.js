const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    /* PROJECT START DATE */
    startMonth: {
      type: String,
      default: "",
    },
    startYear: {
      type: String,
      default: "",
    },
    /* POSSESSION DATE */
    possessionMonth: {
      type: String,
      default: "",
    },
    possessionYear: {
      type: String,
      default: "",
    },
    /* BHK TYPES */
    // Simplified array of strings to avoid nested object issues
    bhkTypes: [String],

    /* PROPERTY TYPE */
    propertyType: {
      type: String,
      // Fixed: Added "" to the enum so the default value is valid and doesn't break updates
      enum: ["Apartment", "Villa", "Open Plot", ""],
      default: "",
    },
    /* AREA */
    sft: {
      type: String,
      default: "",
    },
    /* LOCATION */
    location: {
      type: String,
      default: "",
      trim: true,
    },
    /* PROJECT IMAGES */
    // Simplified array of strings for easier Multer path storage
    images: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);