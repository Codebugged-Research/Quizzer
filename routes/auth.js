const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  //Validating that the body follows the schema
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if mail already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hashing passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: hashedPassword,
  });
  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.TOKEN_SECRET
  );

  try {
    const savedUser = await user.save();
    res.send({ _id: user._id, token: token });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user || user.role != "0") return res.status(400).send("Access Denied");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const role = user.role;
  user.password = undefined;
  // res.render("adminUI/admin", {
  //   token: token,
  //   role: role,
  //   user: user,
  // });
  res.cookie("token", token);
  res.redirect("/api/admin/dashboard/");
});
router.post("/app/login/", async (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err || !user) {
      const salt = bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hash(req.body.password, salt);

      var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.TOKEN_SECRET
      );
      try {
        newUser = user.save();
        newUser.password = undefined;
        res.json({user:newUser,token:token});
      } catch (error) {
        res.status(400).send(error);
      }
    }
    const validPass = bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");
    const token = jwt.sign(
       { _id: user._id, name: user.name },
       process.env.TOKEN_SECRET
    );
    user.password = undefined;
    res.json({user:user,token:token});
  });
});
// if (!user) {
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(req.body.password, salt);

//   const newUser = new User({
//     name: req.body.name,
//     email: req.body.email,
//     password: hashedPassword,
//   });
//   const token = jwt.sign(
//     { _id: newUser._id, name: newUser.name },
//     process.env.TOKEN_SECRET
//   );
//   try {
//     const savedUser = await newUser.save();
//     res.send({ _id: newUser._id, token: token, email: newUser.email });
//   } catch (err) {
//     res.status(400).send(err);
//   }
// }

//   const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
//   res.cookie("token", token);
//   res.send(user);
// });
module.exports = router;
