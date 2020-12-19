const feedRouter = require("express").Router();
const verify = require("./verifyToken");
const File = require("../models/file");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
feedRouter.get("/", (req, res) => {
  File.find().exec((err, files) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.render("adminUI/allFiles", { files: files });
    }
  });
});
feedRouter.get("/upload", (req, res) => {
  res.render("adminUI/feedUpload");
});

feedRouter.delete("/:id", verify, async (req, res) => {
  await File.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/feed");
    }
  });
});
module.exports = feedRouter;
