const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.render("adminUI/admin");
});

module.exports = router;
