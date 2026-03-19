const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const nodemailer = require("nodemailer")
require("dotenv").config()

/* ROUTES */
const projectRoutes = require("./routes/projects")

const app = express()

/* ==============================
   ENSURE UPLOADS FOLDER EXISTS
================================ */

const uploadDir = path.join(__dirname, "uploads")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

/* ==============================
   CORS (FIXED FOR DOMAIN)
================================ */

app.use(cors({
  origin: [
    "https://www.sprajuinfra.com",
    "https://sprajuinfra.com",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

/* ==============================
   MIDDLEWARE
================================ */

app.use(express.json())

/* ==============================
   EMAIL CONFIG (FIXED)
================================ */

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env")
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false   // ✅ FIXED SMTP ERROR
  }
})

transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP Error:", error)
  } else {
    console.log("✅ SMTP Ready")
  }
})

/* ==============================
   MONGODB CONNECTION
================================ */

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env")
}

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err))

/* ==============================
   DATABASE STATUS CHECK
================================ */

app.get("/db-status", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send("✅ MongoDB Connected")
  } else {
    res.send("❌ MongoDB Not Connected")
  }
})

/* ==============================
   ROOT TEST ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("🔥 Backend is working")
})

/* ==============================
   STATIC FILES
================================ */

app.use("/uploads", express.static(uploadDir))

/* ==============================
   API ROUTES
================================ */

app.use("/projects", projectRoutes)

/* ==============================
   🔐 ADMIN LOGIN
================================ */

app.post("/admin-login", (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ success: false, message: "Password required" })
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true })
  }

  res.status(401).json({ success: false, message: "Invalid password" })
})

/* ==============================
   CONTACT FORM - SEND EMAIL
================================ */

app.post("/send-enquiry", async (req, res) => {

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {

    // Send to admin
    await transporter.sendMail({
      from: `"SP Raju Infra" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "📩 New Enquiry - SP Raju Infra",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    })

    // Auto reply to user
    await transporter.sendMail({
      from: `"SP Raju Infra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your enquiry - SP Raju Infra",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting SP Raju Infra. We have received your enquiry and will get back to you shortly.</p>
        <br/>
        <p>Regards,<br/>SP Raju Infra Team</p>
      `
    })

    res.status(200).json({ message: "Enquiry sent successfully" })

  } catch (err) {
    console.error("❌ Email error:", err)
    res.status(500).json({ message: "Failed to send enquiry" })
  }

})

/* ==============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})