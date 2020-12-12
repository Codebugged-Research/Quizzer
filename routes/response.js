//send response form app

const express = require("express");
const responseRouter = express.Router();
const Response = require("../models/response");

responseRouter.post("/submit", async (req, res) => {
  var response = new Response(req.body);
  try {
    await response.save();
    res.json({ message: "Succesfully Submitted" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = responseRouter;
