const feedRouter = require("express").Router();
const verify = require("./verifyToken");
const File = require("../models/file");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
feedRouter.get("/upload", (req, res) => {
  res.render("adminUI/feedUpload");
});
feedRouter.delete("/:id", verify, async (req, res) => {
  await File.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/feed/upload");
    }
  });
});
module.exports = feedRouter;
