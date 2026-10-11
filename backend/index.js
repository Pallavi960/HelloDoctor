require("dotenv").config();

const express = require("express");
const path = require("path");
const doctorRoute = require("./routes/doctor");
const { connectMongoDB } = require("./connection");
const userRoute = require("./routes/users");
const appointmentRoute = require("./routes/appointment");
const adminRoute = require("./routes/admin");
const cors = require("cors");
const notificationRoute = require("./routes/notification");
const cookieParser = require("cookie-parser");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured");
}
if (isProduction && process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
}
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured");
}
if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL must be configured");
}
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured");
}

const allowedOrigins = process.env.FRONTEND_URL
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/doctor", doctorRoute);
app.use("/user", userRoute);
app.use("/appointment", appointmentRoute);
app.use("/notification", notificationRoute);
app.use("/admin", adminRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (isProduction) {
        console.error("Unhandled request error");
        return res.status(500).json({ message: "Internal server error" });
    }
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Internal server error" });
});

connectMongoDB(process.env.MONGO_URI).then(() => {
    console.log("connected");
}).catch(() => {
    console.error("error to connect");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on the ${port}`);
});
