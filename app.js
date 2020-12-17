let express = require("express");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Razorpay = require("razorpay");
var Quiz = require("./models/quiz");
var Question = require("./models/question");
var User = require("./models/user");
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
const quizRoute = require("./routes/quizRouter");
const userRoute = require("./routes/user");
const responseRoute = require("./routes/response");
const subscriptionRoute = require("./routes/subscription");
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

// app.get("/", function (req, res) {
//   res.send("server is live");
// });
app.use(authRoute);
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/quiz", quizRoute);
app.use("/quiz/:id/questions", questionRoute);
app.use("/user", userRoute);
//POST response
app.use("/response", responseRoute);
app.use("/subscription", subscriptionRoute);

app.get("/payments", (req, res) => {
  res.render("adminUI/payment", { key: process.env.KEY_ID });
});
app.post("/api/payment/order", (req, res) => {
  params = req.body;
  instance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
});

app.post("/api/payment/verify", (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  // console.log("sig" + req.body.razorpay_signature);
  // console.log("sig" + expectedSignature);
  var response = { status: "failure" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { status: "success" };
  res.send(response);
});

app.listen(3000, () => console.log("Server started"));
// const httpServer = http.createServer(app);
// httpServer.listen(80, () => {
//   console.log("HTTP Server running on port 80");
// });
