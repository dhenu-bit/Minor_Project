require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const Station = require("./models/Station");

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/Booking");

const app = express();

// Project folders: pages, css, and images are outside backend
const projectRoot = path.join(__dirname, "..");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your existing frontend files
app.use("/pages", express.static(path.join(projectRoot, "pages")));
app.use("/css", express.static(path.join(projectRoot, "css")));
app.use("/js", express.static(path.join(projectRoot, "js")));
app.use("/images", express.static(path.join(projectRoot, "images")));

// Open the website at the root URL
app.get("/", (req, res) => {
    res.redirect("/pages/home.html");
});

// Health-check route
app.get("/api", (req, res) => {
    res.json({
        message: "EV Charging & Booking Hub API is running"
    });
});

// Get charging stations from MongoDB
app.get("/api/stations", async (req, res) => {
    try {
        const stations = await Station.find().sort({ createdAt: -1 });
        res.json(stations);
    } catch (error) {
        console.error("Error loading stations:", error.message);
        res.status(500).json({
            message: "Could not load charging stations"
        });
    }
});

// Signup and login routes
app.use("/api/auth", authRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
    .finally(() => {
        app.listen(PORT, () => {
            console.log(`===============================================`);
            console.log(`⚡ EV Charging & Booking Hub Server is LIVE!`);
            console.log(`🌐 Website URL: http://localhost:${PORT}`);
            console.log(`🏠 Home Page:   http://localhost:${PORT}/pages/home.html`);
            console.log(`📡 Stations API: http://localhost:${PORT}/api/stations`);
            console.log(`===============================================`);
        });
    });