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
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Connected to db")
);
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const questionRoute = require("./routes/questionRouter");
const rewardRoute = require("./routes/rewardRouter");

//Middlewares
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/api/auth", authRoute);
app.get("/", function (req, res) {
  res.send("server is live");
});
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/api/admin/reward", rewardRoute);
app.use("/api/admin/question", questionRoute);

app.listen(3000, () => console.log("Server started"));
// const httpServer = http.createServer(app);
// httpServer.listen(80, () => {
//   console.log("HTTP Server running on port 80");
// });
