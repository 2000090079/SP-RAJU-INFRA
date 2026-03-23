const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const nodemailer = require("nodemailer")
require("dotenv").config()

/* ROUTES */
const projectRoutes = require("./routes/projects")

const app = express()

/* ==============================
   CORS (FOR DOMAIN + LOCAL)
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
   EMAIL CONFIG (DEBUG ENABLED)
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
    rejectUnauthorized: false
  }
})

// 🔥 VERIFY SMTP CONNECTION
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error)
  } else {
    console.log("✅ SMTP Ready to send emails")
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
   HEALTH CHECK ROUTES
================================ */

app.get("/", (req, res) => {
  res.send("🔥 Backend is working")
})

app.get("/db-status", (req, res) => {
  res.send(
    mongoose.connection.readyState === 1
      ? "✅ MongoDB Connected"
      : "❌ MongoDB Not Connected"
  )
})

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
   CONTACT FORM - DEBUG VERSION
================================ */

app.post("/send-enquiry", async (req, res) => {

  console.log("➡️ Incoming request body:", req.body)

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    console.log("❌ Missing fields")
    return res.status(400).json({ message: "All fields are required" })
  }

  try {

    console.log("📩 Enquiry received from:", name, "| Email:", email)

    const info = await transporter.sendMail({
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

    console.log("✅ Email sent successfully:", info.response)

    // Send success response ONLY after mail success
    res.status(200).json({ message: "Enquiry sent successfully" })

    // 🔁 Auto reply (background)
    transporter.sendMail({
      from: `"SP Raju Infra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your enquiry - SP Raju Infra",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting SP Raju Infra.</p>
        <p>Our team will get back to you shortly.</p>
      `
    }).then(() => {
      console.log("📨 Auto-reply sent to user")
    }).catch(err => {
      console.error("❌ Auto-reply failed:", err)
    })

  } catch (err) {
    console.error("❌ EMAIL SEND FAILED:", err)
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