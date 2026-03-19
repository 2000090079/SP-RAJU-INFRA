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

if(!fs.existsSync(uploadDir)){
fs.mkdirSync(uploadDir)
}

/* ==============================
   MIDDLEWARE
================================ */

app.use(cors())
app.use(express.json())

/* ==============================
   EMAIL CONFIG
================================ */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

/* VERIFY CONNECTION */

transporter.verify(function(error, success) {
  if (error) {
    console.log("❌ SMTP Error:", error)
  } else {
    console.log("✅ SMTP Ready")
  }
})

/* ==============================
   MONGODB CONNECTION
================================ */

mongoose.connect("mongodb://127.0.0.1:27017/sprajuinfra")
.then(()=>{
console.log("✅ MongoDB Connected Successfully")
})
.catch((err)=>{
console.error("❌ MongoDB Connection Error:",err)
})

/* ==============================
   DATABASE STATUS CHECK
================================ */

app.get("/db-status",(req,res)=>{
if(mongoose.connection.readyState === 1){
res.send("✅ MongoDB Connected")
}else{
res.send("❌ MongoDB Not Connected")
}
})

/* ==============================
   ROOT TEST ROUTE
================================ */

app.get("/", (req,res)=>{
res.send("🔥 Backend is working")
})

/* ==============================
   STATIC FILES
================================ */

app.use("/uploads",express.static(uploadDir))

/* ==============================
   API ROUTES
================================ */

app.use("/projects",projectRoutes)

/* ==============================
   CONTACT FORM - SEND EMAIL
================================ */

app.post("/send-enquiry", async (req,res)=>{

console.log("🔥 send-enquiry route hit")
console.log("📩 Request body:", req.body)

const { name, email, message } = req.body

/* VALIDATION */
if(!name || !email || !message){
return res.status(400).json({message:"All fields are required"})
}

try{

/* SEND MAIL TO YOU */
await transporter.sendMail({
from: process.env.EMAIL_USER,
to: process.env.EMAIL_USER,
subject: "SP Raju Infra - New Enquiry",
html: `
<h3>New Enquiry Received</h3>
<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Message:</b> ${message}</p>
`
})

/* AUTO REPLY TO USER */
await transporter.sendMail({
to: email,
subject: "We received your enquiry - SP Raju Infra",
html: `
<p>Hi ${name},</p>
<p>Thank you for contacting SP Raju Infra. We have received your enquiry and will get back to you shortly.</p>
<br/>
<p>Regards,<br/>SP Raju Infra Team</p>
`
})

console.log("✅ Email sent successfully")

res.status(200).json({message:"Enquiry sent successfully"})

}catch(err){
console.error("❌ Email error:", err)
res.status(500).json({message:"Failed to send enquiry"})
}

})

/* ==============================
   SERVER START
================================ */

const PORT = 5000

app.listen(PORT,()=>{
console.log(`🚀 Server running on port ${PORT}`)
})