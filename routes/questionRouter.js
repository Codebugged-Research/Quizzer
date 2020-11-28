const express = require("express");
const questionRouter = express.Router();
const database = require("../models/quiz");
const db = database.db;

questionRouter.get("/", async (req, res) => {
  // console.log('get all questions')
  const snapshots = await db.collection("questions").get();
  let questions = [];
  snapshots.forEach((snapshot) => {
    questions.push(snapshot.data());
  });
  res.status(200).json(questions);
});

questionRouter.post("/add", async (req, res) => {
  // console.log('add product')
  const question = req.body;
  const document = await db.collection("questions").doc();
  await document.set({
    id: document.id,
    ...question,
  });
  res.status(201).json(question);
});

proquestionRouter.post("/update/:id", async (req, res) => {
  // console.log('get update product')
  // console.log(req.body)
  const questionId = req.params.id;
  if (!questionId) {
    res.status(401).json({ error: "Id not provided" });
  }
  const { item_name, prize, item_description, duration } = req.body;
  const batch = db.batch();
  const docRef = await db.collection("products").doc(itemId);
  batch.update(docRef, { name: item_name });
  batch.update(docRef, { description: item_description });
  batch.update(docRef, { prize: prize });
  batch.update(docRef, { duration: duration });
  await batch.commit();
  res.status(201).send("Success");
});

questionRouter.delete("/delete/:id", async (req, res) => {
  // console.log('delete question')
  const itemId = req.params.id;
  if (!itemId) {
    res.status(401).json({ error: "ID not provided" });
  }
  //Delete item and return status code
});

questionRouter.get("/details/:id", async (req, res) => {
  // console.log('get question by id')
  const id = req.params.id;
  const question = await getquestionByID(id);
  res.json(question);
});

const getQuestionByID = async (id) => {
  try {
    const question = [];
    const snap = await db.collection("questions").where("id", "==", id).get();
    snap.forEach((doc) => {
      question.push(doc.data());
    });
    return question[0];
  } catch (error) {
    console.log(error);
    throw "No Such Question";
  }
};

module.exports = questionRouter;
