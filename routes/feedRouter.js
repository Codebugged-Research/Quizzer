const feedRouter = require("express").Router();
const verify = require("./verifyToken");
const feed = require("../models/file");
var fs = require("fs");
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
});

feedRouter.get("/", (req, res) => {
  feed
    .find()
    .sort({ createdAt: -1 })
    .exec((err, files) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.render("adminUI/allFiles", { files: files });
      }
    });
});

feedRouter.get("/upload", verify, (req, res) => {
  res.render("adminUI/feedUpload");
});

feedRouter.post("/uploadFeed", upload.single("upload"), function (req, res) {
  var name = req.file.originalname.split(".");
  var fileName = name[name.length - 1];
  var src = fs.createReadStream(req.file.path);
  var date = Date.now();
  var dest = fs.createWriteStream("./uploads/" + date + "." + fileName);
  src.pipe(dest);
  src.on("end", function () {
    fs.unlinkSync(req.file.path);

    var url = "http://quizaddaplus.tk/upload/" + date + "." + fileName;
    card = new Card({ imageURL: url });
    var ffeed = new feed({ fileURL: url, name: req.body.name });
    ffeed.save();
    res.redirect("/feed/upload");
  });
  src.on("error", function (err) {
    if (err) res.json("Something went wrong!");
  });
});

// feedRouter.post("/uploadFeed", verify, (req, res) => {
//   console.log(req.body);
//   const upload = multer({
//     storage: multerS3({
//       s3: uploadFeedS3,
//       bucket: "quizaddabox",
//       acl: "public-read",
//       key: function (reqq, file, cb) {
//         cb(null, file.originalname);
//         var url =
//           "https://quizaddabox.ams3.digitaloceanspaces.com/feed/" +
//           file.originalname;
//         var ffeed = new feed({ fileURL: url, name: req.body.name });
//         ffeed.save();
//       },
//     }),
//   }).array("upload", 1);
//   upload(req, res, function (error) {
//     if (error) {
//       console.log(error);
//       return res.json({
//         error: error,
//       });
//     }
//     res.redirect("/feed/upload");
//   });
// });
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
