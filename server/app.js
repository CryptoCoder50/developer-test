const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const userRouter = require("./routes/userRoute");
const technicalAssessmentRoute = require("./routes/technicalAssessmentRoute");

const app = express();

// config
console.log("loaded technicalAssessment", typeof technicalAssessmentRoute);
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user', userRouter);
app.use(fileUpload());
app.use("/api", technicalAssessmentRoute);

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("/__health", (req, res)=> res.json({ ok: true }));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

// error middleware
// app.use(errorMiddleware);

module.exports = app;
