const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

/* 🔥 RESEND */
const { Resend } = require("resend")
const resend = new Resend(process.env.RESEND_API_KEY)

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
   ENV CHECK
================================ */

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY missing in .env")
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env")
}

/* ==============================
   MONGODB CONNECTION
================================ */

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
   CONTACT FORM (RESEND VERSION)
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

    // ✅ SEND EMAIL TO ADMIN
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default working sender
      to: process.env.EMAIL_USER, // your email
      subject: "📩 New Enquiry - SP Raju Infra",
      html: `
        <h3>New Enquiry Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    })

    console.log("✅ Email sent:", response)

    res.status(200).json({ message: "Enquiry sent successfully" })

    // 🔁 AUTO REPLY (optional)
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "We received your enquiry - SP Raju Infra",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting SP Raju Infra.</p>
        <p>Our team will get back to you shortly.</p>
      `
    }).then(() => {
      console.log("📨 Auto-reply sent")
    }).catch(err => {
      console.error("❌ Auto-reply failed:", err)
    })

  } catch (err) {
    console.error("❌ RESEND ERROR:", err)
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