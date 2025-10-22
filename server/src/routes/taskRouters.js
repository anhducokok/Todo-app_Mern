import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", (req, res) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Get all tasks'
    #swagger.description = 'Retrieve all tasks with optional filtering and pagination'
    #swagger.parameters['status'] = {
      in: 'query',
      description: 'Filter by status',
      type: 'string',
      enum: ['active', 'completed', 'all']
    }
    #swagger.parameters['priority'] = {
      in: 'query',
      description: 'Filter by priority',
      type: 'string',
      enum: ['low', 'medium', 'high', 'all']
    }
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Search tasks by title',
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Tasks retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            items: {
              $ref: '#/definitions/Task'
            }
          },
          activeCount: { type: 'number' },
          completedCount: { type: 'number' }
        }
      }
    }
  */
  getTasks(req, res);
});

router.post("/", (req, res) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Create a new task'
    #swagger.description = 'Create a new task with title, priority and optional due date'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Task data',
      required: true,
      schema: {
        $ref: '#/definitions/Task'
      }
    }
    #swagger.responses[201] = {
      description: 'Task created successfully',
      schema: {
        $ref: '#/definitions/Task'
      }
    }
    #swagger.responses[400] = {
      description: 'Validation error',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  */
  createTask(req, res);
});

router.put("/:id", (req, res) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Update a task'
    #swagger.description = 'Update task details by ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated task data',
      required: true,
      schema: {
        $ref: '#/definitions/Task'
      }
    }
    #swagger.responses[200] = {
      description: 'Task updated successfully',
      schema: {
        $ref: '#/definitions/Task'
      }
    }
    #swagger.responses[404] = {
      description: 'Task not found'
    }
  */
  updateTask(req, res);
});

router.delete("/:id", (req, res) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Delete a task'
    #swagger.description = 'Delete a task by ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Task deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Task deleted successfully' }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Task not found'
    }
  */
  deleteTask(req, res);

});
router.get("/:id", (req, res) => {
  /* 
    #swagger.tags = ['Tasks']
    #swagger.summary = 'Get task by ID'
    #swagger.description = 'Retrieve a task by its ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Task ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Task retrieved successfully',
      schema: {
        $ref: '#/definitions/Task'
      }
    }
    #swagger.responses[404] = {
      description: 'Task not found'
    }
  */
  getTaskById(req, res);
});
export default router;
