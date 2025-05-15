import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Initialize app
const app = express()
dotenv.config()

// Middleware
app.use(express.json())

// CORS සැකසුම් update කර ඇත - localhost සහ production URL දෙකම ඇතුළත් කර ඇත
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://hotel-management-system-red.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

// Set up static files directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Static files serving setup
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(express.static(path.join(__dirname, "public")))

// Log the uploads directory path for debugging
console.log("Uploads directory path:", path.join(__dirname, "uploads"))

import foodRouter from "./routers/food.router.js"
import userRouter from "./routers/user.router.js"
import uploadRouter from "./routers/upload.router.js"
import eventsRoute from "./routers/eventsRoute.js"
import eventPlannerRoute from "./routers/eventPlannerRoute.js"
import customerRouter from "./routers/customers.js"
import roomRouter from "./routers/rooms.js"
import voucherRouter from "./routers/vouchers.js"

import { dbconnect } from "./config/database.config.js"
dbconnect()

app.use("/api/foods", foodRouter)
app.use("/api/users", userRouter)
app.use("/api/upload", uploadRouter)

// event management
app.use("/events", eventsRoute)
app.use("/eventplanners", eventPlannerRoute)

// Customer Management
app.use("/customer", customerRouter)
app.use("/room", roomRouter)

// employee
import EmployeeRouter from "./routers/Employees.js"
app.use("/employee", EmployeeRouter)

// leave
import LeaveRouter from "./routers/Leaves.js"
app.use("/leave", LeaveRouter)

// Bar
import orderRoutes from "./routers/orders.js"
import giftsRouter from "./routers/gifts.js"
import giftOrderRoutes from "./routers/gift-orders.js"
import itemRoutes from "./routers/itemRoutes.js"
import userRoutes from "./routers/userRoutes.js"
import billsRoutes from "./routers/billsRoutes.js"
import payment from "./routers/payments.js"

app.use("/api/items", itemRoutes)
app.use("/api/users", userRoutes)
app.use("/api/bills", billsRoutes)

// Gifts Management
app.use("/orders", orderRoutes)
app.use("/gifts", giftsRouter)
app.use("/gift-orders", giftOrderRoutes)
app.use("/payments", payment)

// Vouchers Management
app.use("/vouchers", voucherRouter)

// Enhanced image checking route - supports checking in different folders
app.get("/check-image/:folder/:filename", (req, res) => {
  const { folder, filename } = req.params
  const imagePath = path.join(__dirname, "uploads", folder, filename)

  if (fs.existsSync(imagePath)) {
    res.json({
      exists: true,
      path: imagePath,
      url: `/uploads/${folder}/${filename}`,
    })
  } else {
    res.json({
      exists: false,
      path: imagePath,
      searchedIn: path.join(__dirname, "uploads", folder),
    })
  }
})

// Original image check route - kept for backward compatibility
app.get("/check-image/:filename", (req, res) => {
  const filename = req.params.filename
  const imagePath = path.join(__dirname, "uploads", "items", filename)

  if (fs.existsSync(imagePath)) {
    res.json({
      exists: true,
      path: imagePath,
      url: `/uploads/items/${filename}`,
    })
  } else {
    res.json({
      exists: false,
      path: imagePath,
      searchedIn: path.join(__dirname, "uploads", "items"),
    })
  }
})

// Serve static files
app.use(express.static("public"))

// Add a simple diagnostic route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" })
})

// Enhanced health check endpoint
app.get("/api/health", (req, res) => {
  // Check if uploads directory exists
  const uploadsExists = fs.existsSync(path.join(__dirname, "uploads"))
  
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uploadsDirectory: {
      path: path.join(__dirname, "uploads"),
      exists: uploadsExists
    },
    cors: {
      origins: ["http://localhost:3000", "https://hotel-management-system-red.vercel.app"]
    }
  })
})

// Start server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
