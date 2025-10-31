import { NavLink } from 'react-router-dom'
import { insertTask, selectAllTasks, removeTask } from '../models/task.js'

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next(error)
    }
}

const postTask = async (req, res, next) => {
    const { task } = req.body
    try {
        if (!task || !task.description.trim().length === 0) {
            const error = new Error('Task description is required')
            error.status = 400
            return next(error)
        }

        const result = await insertTask(task.description)
        return res.status(201).json({ id: result.rows[0].id, description: result.rows[0].description })
    } catch (error) {
        return next(error)
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) { return res.status(400).json({ error: 'Task ID is required' })}
        
        const result = await removeTask(id)
        if (result.rowCount === 0) { return res.status(404).json({ error: 'Task not found' }) }

        console.log(`Deleting task with id: ${id}`)
        res.status(200).json({ message: 'Task deleted', task: result.rows[0] })
    } catch (error) {
        console.error('Error deleting task:', error)
        return next(error)
    }
}

export { getTasks, postTask, deleteTask }