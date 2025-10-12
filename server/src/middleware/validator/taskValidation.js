import Joi from 'joi';
import {     ValidationError } from 'sequelize';
import { CustomError } from '../utils/customError.js';

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  status: Joi.string().valid('active', 'completed').optional().default('active'),
  priority: Joi.string().valid('low', 'medium', 'high').optional().default,
  completed: Joi.date().optional().allow(null),
});


function validateCreateTask(req, res, next) {
  const { error,value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message),
    });
  }
  req.body = value; // Cập nhật req.body với giá trị đã được chuẩn hóa
  next();
}

function validateUpdateTask(req, res, next) {
  const taskSchema = Joi.object({
    title: Joi.string().min(1).max(255).optional().trim(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
  });
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }
  req.body = value;
  next();
}

export { validateCreateTask, validateUpdateTask };
