const express = require("express");
const router = express.Router();
const TaskModel = require("../models/Task.model");
const ProjectModel = require("../models/Project.model");

// CRUD de projeto

// Definindo nossos route listeners

// Crud (Create) => POST
router.post("/task", async (req, res, next) => {
  try {
    const result = await TaskModel.create(req.body);

    // Adicionado a referência da tarefa recém-criada no projeto
    await ProjectModel.updateOne(
      { _id: req.body.projectId },
      { $push: { tasks: result._id } }
    ); // O operador $push serve para adicionar um novo elemento à uma array no documento

    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
});

// crUd (Update) => PATCH
router.patch("/task/:id", (req, res, next) => {
  // Extraindo o parâmetro de rota
  const { id } = req.params;

  TaskModel.findOneAndUpdate(
    { _id: id },
    { $set: { ...req.body } },
    { new: true, runValidators: true }
  )
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
});

// cruD (Delete) => DELETE
router.delete("/task/:id", async (req, res, next) => {
  try {
    // Extraindo o parâmetro de rota
    const { id } = req.params;

    const result = await TaskModel.deleteOne({ _id: id });

    if (result.deletedCount < 1) {
      return res.status(404).json({ msg: "Tarefa não encontrada." });
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
