const fileRouter = require("express").Router();
const verify = require("./verifyToken");

const aws = require("aws-sdk");
aws.config.update({
  accessKeyId: "AKHJVLMXHVD6T5YWQ4PF",
  secretAccessKey: "dc5BXjf/zC1ryGMC4TzxUnQLYsJWPIjQS73kHJx+yf0",
  region: "ams3",
});
const uploadEndPoint = new aws.Endpoint("ams3.digitaloceanspaces.com");
const uploads3 = new aws.S3({
  endpoint: uploadEndPoint,
});

fileRouter.get("/upload", async (req, res) => {
  res.render("adminUI/fileUpload");
});

fileRouter.post("/uploadfile", (req, res) => {
  const upload = multer({
    storage: multerS3({
      s3: uploads3,
      bucket: "quizaddabox",
      acl: "public-read",
      key: function (request, file, cb) {
        cb(null, file.originalname);
      },
    }),
  }).array("upload", 1);
  upload(req, res, function (error) {
    if (error) {
      return response.json({
        error: error,
      });
    }
    response.redirect("/admin/category.html");
  });
});
module.exports = fileRouter;
