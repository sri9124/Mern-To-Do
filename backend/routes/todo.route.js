import express from 'express'
import Todo from '../models/todo.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find()
        res.send(todos)
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })
    try {
        const newTodo = await todo.save()
        res.status(201).send(newTodo)
    } catch (error) {
        res.status(400).send({ msg: error.message }) 
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).send({ msg: "TODO NOT FOUND" })
        }

        if (req.body.text !== undefined) {
            todo.text = req.body.text
        }
        if (req.body.completed !== undefined) {
            todo.completed = req.body.completed
        }

        const updatedTodo = await todo.save()
        res.status(200).send(updatedTodo)
    } catch (error) {
        res.status(400).send({ msg: error.message }) 
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id)
        res.send({ msg: "TODO DELETED" })
    } catch (error) { 
        res.status(500).send({ msg: error.message }) 
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).send({ msg: "TODO NOT FOUND" })
        }

        if (req.body.text !== undefined) {
            todo.text = req.body.text
        }
        if (req.body.completed !== undefined) { 
            todo.completed = req.body.completed
        }

        const updatedTodo = await todo.save()
        res.status(200).send(updatedTodo) 
    } catch (error) { 
        res.status(400).send({ msg: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id); 
        if (!todo) {
            return res.status(404).send({ msg: "TODO NOT FOUND" });
        }
        res.send({ msg: "TODO DELETED", id: req.params.id }) 
    } catch (error) { 
        res.status(500).send({ msg: error.message })
    }
})

export default router