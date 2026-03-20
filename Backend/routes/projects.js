const express = require("express")
const router = express.Router()
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const Project = require("../models/Project")

/* ==============================
   CLOUDINARY STORAGE
================================ */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sp-raju-projects",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

const upload = multer({ storage })

/* ==============================
   GET ALL PROJECTS
================================ */

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 })
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch projects" })
  }
})

/* ==============================
   CREATE PROJECT
================================ */

router.post("/", upload.array("images", 10), async (req, res) => {
  try {

    const imageUrls = req.files
      ? req.files.map(file => file.path)   // ✅ CLOUDINARY URL
      : []

    /* SAFE BHK PARSE */
    let bhkTypes = []
    if (req.body.bhkTypes) {
      try {
        bhkTypes = Array.isArray(req.body.bhkTypes)
          ? req.body.bhkTypes
          : JSON.parse(req.body.bhkTypes)
      } catch {
        bhkTypes = []
      }
    }

    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "ongoing",
      startMonth: req.body.startMonth || "",
      startYear: req.body.startYear || "",
      possessionMonth: req.body.possessionMonth || "",
      possessionYear: req.body.possessionYear || "",
      bhkTypes: bhkTypes,
      propertyType: req.body.propertyType?.trim() || "",
      sft: req.body.sft || "",
      location: req.body.location || "",
      images: imageUrls   // ✅ STORE CLOUDINARY LINKS
    })

    const savedProject = await project.save()
    res.json(savedProject)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Upload failed" })
  }
})

/* ==============================
   UPDATE PROJECT
================================ */

router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {

    const updateData = {}

    const fields = [
      "title",
      "description",
      "status",
      "startMonth",
      "startYear",
      "possessionMonth",
      "possessionYear",
      "sft",
      "location"
    ]

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field]
      }
    })

    /* PROPERTY TYPE */
    if (req.body.propertyType !== undefined) {
      updateData.propertyType = req.body.propertyType.trim()
    }

    /* BHK TYPES */
    if (req.body.bhkTypes) {
      try {
        updateData.bhkTypes = Array.isArray(req.body.bhkTypes)
          ? req.body.bhkTypes
          : JSON.parse(req.body.bhkTypes)
      } catch {
        console.log("BHK Parse Error")
      }
    }

    /* HANDLE NEW IMAGES */
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path) // ✅ CLOUDINARY
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(updatedProject)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Update failed" })
  }
})

/* ==============================
   DELETE PROJECT
================================ */

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Optional: delete from cloudinary (advanced - skip for now)

    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Delete failed" })
  }
})

module.exports = router