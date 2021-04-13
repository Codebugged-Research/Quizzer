let express = require("express");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const http = require("http");
var admin = require("firebase-admin");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const Razorpay = require("razorpay");
var Quiz = require("./models/quiz");
var Question = require("./models/question");
var User = require("./models/user");
dotenv.config();
let app = express();

var serviceAccount = require("./fb/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
const paytmRoutes = require("./routes/paytm");

const razorPayRoute = require("./routes/payment");
const authRoute = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const questionRoute = require("./routes/questionRouter");
const quizRoute = require("./routes/quizRouter");
const userRoute = require("./routes/user");
const responseRoute = require("./routes/response");
const subscriptionRoute = require("./routes/subscription");
const fileRoute = require("./routes/fileUpload");
const leaderboardRoute = require("./routes/leaderboard");
const feedRoute = require("./routes/feedRouter");
const fcmRoute = require("./routes/notification");
const offerRoute = require("./routes/offerRouter");
// const paymentRoute = require("./routes/payment");
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  res.render("adminUI/landing");
});
app.get("/privacy", (req, res) => {
  res.render("adminUI/privacy-policy");
});
app.get("/terms", (req, res) => {
  res.render("adminUI/terms-conditions");
});
app.get("/refund", (req, res) => {
  res.render("adminUI/refund-policy");
});

app.use(authRoute);
app.use("/paytm", paytmRoutes);
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/quiz", quizRoute);
app.use("/quiz/:id/questions", questionRoute);
app.use("/quiz/:id/leaderboard", leaderboardRoute);
app.use("/user", userRoute);
//POST response
app.use("/response", responseRoute);
app.use("/fcm", fcmRoute);
app.use("/subscription", subscriptionRoute);
app.use("/razorPay", razorPayRoute);
app.use("/file", fileRoute);
app.use("/feed", feedRoute);
app.use("/offer", offerRoute);

// app.listen(3000, () => console.log("Server started"));
const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});
