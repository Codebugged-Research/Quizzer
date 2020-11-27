let express = require("express");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const http = require("http");
dotenv.config();
let app = express();
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to db")
);
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
app.use("/admin", express.static(path.join(__dirname, '/views/adminUI/login')));
app.get("/", (req, res) => {
  res.send("server is live");
});
//Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

// app.listen(3000, () => console.log("Server started"));
const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});
