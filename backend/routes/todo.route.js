import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  const { text, description, time } = req.body;
  const todo = new Todo({ text, description, time });

  try {
    const newTodo = await todo.save();
    res.status(201).send(newTodo);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// PATCH update todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send({ msg: "TODO NOT FOUND" });

    const { text, description, time, completed } = req.body;

    if (text !== undefined) todo.text = text;
    if (description !== undefined) todo.description = description;
    if (time !== undefined) todo.time = time;
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();
    res.status(200).send(updatedTodo);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).send({ msg: "TODO NOT FOUND" });
    res.send({ msg: "TODO DELETED", id: req.params.id });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

export default router;
