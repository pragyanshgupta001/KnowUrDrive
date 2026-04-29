import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./src/config/db.js";
import { startAllCronJobs } from "./src/utils/cronJobs.js";

import authRoute from "./src/routes/authRoute.js";
import collegeRoute from "./src/routes/collegeRoute.js";
import driveRoute from "./src/routes/driveRoute.js";
import applicationRoute from "./src/routes/applicationRoute.js";
import noticeRoute from "./src/routes/noticeRoute.js";
import studentRoute from "./src/routes/studentRoute.js";
import tpoRoute from "./src/routes/tpoRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
//import chatbotRoute from "./src/routes/chatbotRoute.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => res.send("API Running..."));

app.use("/auth", authRoute);
app.use("/colleges", collegeRoute);
app.use("/drives", driveRoute);
app.use("/applications", applicationRoute);
app.use("/notices", noticeRoute);
app.use("/students", studentRoute);
app.use("/tpo", tpoRoute);
app.use("/admin", adminRoute);
//app.use("/chatbot", chatbotRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAllCronJobs();
});