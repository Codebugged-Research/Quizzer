const fileRouter = require("express").Router();
const verify = require("./verifyToken");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Card = require("../models/card");
const aws = require("aws-sdk");
aws.config.update({
  accessKeyId: "AKHJVLMXHVD6T5YWQ4PF",
  secretAccessKey: "dc5BXjf/zC1ryGMC4TzxUnQLYsJWPIjQS73kHJx+yf0",
  region: "ams3",
});
const uploadEndPoint = new aws.Endpoint("ams3.digitaloceanspaces.com/banner");
const uploads3 = new aws.S3({
  endpoint: uploadEndPoint,
});

fileRouter.get("/upload", async (req, res) => {
  res.render("adminUI/fileUpload");
});
fileRouter.get("/allCards", (req, res) => {
  Card.find().exec((err, cards) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(cards);
    }
  });
});
fileRouter.post("/uploadfile", (req, res) => {
  console.log(req.body);
  const upload = multer({
    storage: multerS3({
      s3: uploads3,
      bucket: "quizaddabox",
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, file.originalname);
        var url =
          "https://quizaddabox.ams3.digitaloceanspaces.com/banner/" +
          file.originalname;
        card = new Card({ imageURL: url });
        card.save();
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
    res.redirect("/file/upload");
  });
});
quizRouter.delete("/:id", verify, async (req, res) => {
  await Card.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/file/upload");
    }
  });
});
module.exports = fileRouter;
