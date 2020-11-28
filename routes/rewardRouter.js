const express = require("express");
const rewardRouter = express.Router();
const database = require("../models/reward");
const {
  getRewards,
  createReward,
  getRewardByUserID,
  getRewardByRewardID,
  updateStatus,
} = require("../models/reward");
const reward = require("../models/reward");
const db = database.db;

rewardRouter.get("/", async (req, res) => {
  // console.log('get all rewards')
  const rewards = await getRewards();
  res.json(rewards);
});

rewardRouter.get("/:id", async (req, res) => {
  // console.log('get reward by user id')
  const id = req.params.id;
  const rewardList = await getRewardByUserID(id);
  res.json(rewardList);
});

rewardRouter.get("/ord/:id", async (req, res) => {
  // console.log('get reward by reward id')
  const id = req.params.id;
  const rewardList = await getRewardByRewardID(id);
  res.json(rewardList);
});

rewardRouter.post("/create", async (req, res) => {
  const reward = await createReward(req.body);
  res.json(reward);
});

rewardRouter.post("/status/:id", async (req, res) => {
  const status = req.body;
  var result = await updateStatus(req.params.id, status);
  result == true
    ? res.status(200).json({ success: 1 })
    : res.status(400).json({ success: 0 });
});

module.exports = rewardRouter;
