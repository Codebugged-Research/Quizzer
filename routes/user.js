const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");

module.exports = userRouter;
