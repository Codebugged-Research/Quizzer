let express = require("express");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
let app = express();
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to db")
);
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const questionRoute = require("./routes/questionRouter");
const rewardRoute = require("./routes/rewardRouter");

//Middlewares
app.use(express.json());
app.use("/admin", authRoute);
app.use("/admin/dashboard", dashboardRoute);
app.use("/admin/reward", rewardRoute);
app.use("/admin/question", questionRoute);

app.listen(3000, () => console.log("Server started"));
