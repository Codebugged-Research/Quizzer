const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
let app = express();

app.listen(3000, () => console.log("Server started"));
