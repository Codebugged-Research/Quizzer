const cron = require("node-cron");
const Quiz = require("../models/quiz");
var admin = require("firebase-admin");

cron.schedule("*/5 * * * *", () => {
    try {
        var date = new Date();
        Quiz.find({ checkTime: { $gte: date } }, (err, quizs) => {
            if (err) {
                console.log(err);
            } else {
                quizs.forEach((quiz) => {
                    if (quiz) {
                        const diffTime = parseInt(Math.abs(quiz.checkTime - date) / 1000 / 60);
                        console.log(diffTime);
                        if (diffTime < 5) {
                            console.log("send notification");
                            var payload = {
                                notification: {
                                    title: "New Quiz Update !",
                                    body: `New quiz "${quiz.name}" has been added.`,
                                },
                            };
                            var topic = "quiz";
                            admin
                                .messaging()
                                .sendToTopic(topic, payload)
                                .then(function (response) {
                                    console.log("true");
                                })
                                .catch(function (error) {
                                    console.log("false");
                                });
                        } else {
                            console.log("notification not sent");
                        }
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
});