let express = require("express");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const http = require("http");
dotenv.config();
let app = express();
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to db")
);
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const questionRoute = require("./routes/questionRouter");
const rewardRoute = require("./routes/rewardRouter");

//Middlewares
app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/api/auth", authRoute);
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/api/admin/reward", rewardRoute);
app.use("/api/admin/question", questionRoute);

// app.listen(3000, () => console.log("Server started"));
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log("HTTP Server running on port 3000");
});
