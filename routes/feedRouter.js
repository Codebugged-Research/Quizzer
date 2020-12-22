const feedRouter = require("express").Router();
const verify = require("./verifyToken");
const feed = require("../models/file");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const feedEndpoint = new aws.Endpoint("ams3.digitaloceanspaces.com/feed");
aws.config.update({
  accessKeyId: "AKHJVLMXHVD6T5YWQ4PF",
  secretAccessKey: "dc5BXjf/zC1ryGMC4TzxUnQLYsJWPIjQS73kHJx+yf0",
  region: "ams3",
});
const uploadFeedS3 = new aws.S3({
  endpoint: feedEndpoint,
})

feedRouter.get("/", (req, res) => {
  feed.find().exec((err, files) => {
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

feedRouter.post("/uploadFeed", (req, res) => {
  console.log(req.body);
  const upload = multer({
    storage: multerS3({
      s3: uploadFeedS3,
      bucket: "quizaddabox",
      acl: "public-read",
      key: function (reqq, file, cb) {
        cb(null, file.originalname);
        var url =
          "https://quizaddabox.ams3.digitaloceanspaces.com/feed/" +
          file.originalname;
        var ffeed = new feed({ fileURL: url, name: req.body.name });
        ffeed.save();
      },
    }),
  }).array("upload", 1);
  upload(req, res, function (error) {
    if (error) {
      console.log(error);
      return res.json({
        error: error,
      });
    }
    res.redirect("/feed/upload");
  });
});
feedRouter.get("/get", (req, res) => {
  feed.find().exec((err, files) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(files);
    }
  });
});

feedRouter.delete("/:id", verify, async (req, res) => {
  await feed.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/feed");
    }
  });
});
module.exports = feedRouter;
