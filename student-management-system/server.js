require("dotenv").config();

const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const requestLogger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());

// Custom logger middleware
app.use(requestLogger);

// Health/root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management System REST API is running",
    endpoints: {
      students: "/students",
      health: "/health"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP"
  });
});

// Modular student routes
app.use("/students", studentRoutes);

// 404 middleware must come after all routes
app.use(notFound);

// Global error-handling middleware must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Student Management API running at http://localhost:${PORT}`);
});