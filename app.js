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
const postRoute = require("./routes/posts");

//Middlewares
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

app.listen(3000, () => console.log("Server started"));
