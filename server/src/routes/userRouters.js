import express from "express";
import { login, register } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get user info'
    #swagger.description = 'Test endpoint for user routes'
    #swagger.responses[200] = {
      description: 'User route working',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User route is working!' }
        }
      }
    }
  */
  res.send("User route is working!");
});

router.post("/login", (req, res) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'User login'
    #swagger.description = 'Authenticate user with email and password'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Login credentials',
      required: true,
      schema: {
        $ref: '#/definitions/LoginRequest'
      }
    }
    #swagger.responses[200] = {
      description: 'Login successful',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            $ref: '#/definitions/User'
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Invalid credentials',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Invalid credentials' }
        }
      }
    }
  */
  login(req, res);
});

router.post("/register", (req, res) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Register new user'
    #swagger.description = 'Create a new user account'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User registration data',
      required: true,
      schema: {
        $ref: '#/definitions/RegisterRequest'
      }
    }
    #swagger.responses[201] = {
      description: 'User registered successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'User registered successfully' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            $ref: '#/definitions/User'
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Validation error or user already exists',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'User already exists' }
        }
      }
    }
  */
  register(req, res);
});

export default router;
