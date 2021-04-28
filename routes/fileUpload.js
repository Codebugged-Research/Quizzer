const fileRouter = require("express").Router();
const verify = require("./verifyToken");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
const multerS3 = require("multer-s3");
const Card = require("../models/card");
const aws = require("aws-sdk");
aws.config.update({
  accessKeyId: "AKHJVLMXHVD6T5YWQ4PF",
  secretAccessKey: "dc5BXjf/zC1ryGMC4TzxUnQLYsJWPIjQS73kHJx+yf0",
  region: "ams3",
});

const uploadBannerEndpoint = new aws.Endpoint(
  "ams3.digitaloceanspaces.com/banner"
);
const feedEndpoint = new aws.Endpoint("ams3.digitaloceanspaces.com/feed");

const uploadBannerS3 = new aws.S3({
  endpoint: uploadBannerEndpoint,
});

fileRouter.get("/", async (req, res) => {
  Card.find().exec((err, cards) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.render("adminUI/allCards", { cards: cards });
    }
  });
});

fileRouter.get("/upload", verify, async (req, res) => {
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

fileRouter.post("/uploadfile", upload.single("upload"), function (req, res) {
  var name = file.originalname.split(".");
  var fileName = name[name.length - 1];
  var src = fs.createReadStream(req.file.path);
  var dest = fs.createWriteStream("./uploads/" + Date.now() + "." + fileName);
  src.pipe(dest);
  src.on("end", function () {
    fs.unlinkSync(req.file.path);

    var url = "http://quizaddaplus.tk/upload/" + Date.now() + "." + fileName;
    card = new Card({ imageURL: url });
    card.save();
    res.json("OK: received ");
    res.redirect("/file/upload");
  });
  src.on("error", function (err) {
    if (err) res.json("Something went wrong!");
  });
});

// fileRouter.post("/uploadfile", verify, (req, res) => {
//   console.log(req.body);

// const upload = multer({
//   storage: multerS3({
//     s3: uploadBannerS3,
//     bucket: "quizaddabox",
//     acl: "public-read",
//     key: function (req, file, cb) {
//       cb(null, file.originalname);
// var url =
//   "https://quizaddabox.ams3.digitaloceanspaces.com/banner/" +
//   file.originalname;
// card = new Card({ imageURL: url });
// card.save();
//     },
//   }),
// }).array("upload", 1);
// upload(req, res, function (error) {
//   if (error) {
//     console.log(error);
//     return res.json({
//       error: error,
//     });
//   }
//   res.redirect("/file/upload");
// });
// });
fileRouter.delete("/:id", verify, async (req, res) => {
  await Card.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/file/upload");
    }
  });
});
module.exports = fileRouter;
