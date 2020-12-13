const router = require("express").Router();
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const User = require("../models/user");
// router.get("/", verify, (req, res) => {
//   res.render("adminUI/index");
// });
router.get("/", verify, async (req, res) => {
  await Quiz.find({}, async (err, allQuiz) => {
    if (err) {
      console.log(err);
    } else {
      await User.find({}, async (err, allUsers) => {
        if (err) {
          console.log(err);
        } else {
          res.render("adminUI/index", {
            allQuiz: allQuiz,
            allUsers: allUsers,
          });
        }
      });
    }
  });
});
module.exports = router;
