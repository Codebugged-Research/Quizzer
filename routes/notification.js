var admin = require("firebase-admin");

const express = require("express");
const notificationrouter = express.Router();


notificationrouter.post('/single', (req, res) => {
    var payload = {
      notification: {
        title: req.body.title,
        body: req.body.message,
      },
    };
    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 4,
    };
    admin
      .messaging()
      .sendToDevice(req.body.deviceToken, payload, options)
      .then(function (response) {
        return res.json({
          message: "Successfully Send",
        });
      })
      .catch(function (error) {
        return res.json({
          message: "Not Send",
        });
      });
  });
  
  notificationrouter.post('/all', (req, res) => {
    var payload = {
      notification: {
        title: "New Quiz Update !",
        body: `New quiz "${req.body.quizname}" has been added.` ,
      },
    };
    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 4,
    };
  
    var topic = "quiz";
  
    admin
      .messaging()
      .sendToTopic(topic, payload, options)
      .then(function (response) {
        return res.json({
          message: "Successfully Send",
        });
      })
      .catch(function (error) {
        return res.json({
          message: "Not Send",
        });
      });
  });
  

  module.exports = notificationrouter;