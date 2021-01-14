const landRouter = require(express).Router();
landRouter.get("/privacy", (req, res) => {
  res.render("adminUI/privacy-policy");
});
landRouter.get("/terms", (req, res) => {
  res.render("adminUI/terms-conditions");
});
module.exports = landRouter;
