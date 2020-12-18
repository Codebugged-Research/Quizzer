const fileRouter = require("express").Router();
const verify = require("./verifyToken");
fileRouter.get("/upload", async (req, res) => {
  res.render("adminUI/fileUpload");
});
module.exports = fileRouter;
