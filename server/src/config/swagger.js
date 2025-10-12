import swaggerUi, { serve } from 'swagger-ui-express';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'Complete API documentation for Task Management application with user authentication',
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Tasks', description: 'Task management endpoints - CRUD operations for tasks' },
    { name: 'Users', description: 'User management endpoints - Authentication and user operations' },
    { name: 'Health', description: 'Health check and API status endpoints' }
  ],
  schemes: ['http'],
  definitions: {
    Task: {
      _id: '507f1f77bcf86cd799439011',
      title: 'Complete project documentation',
      status: 'active',
      priority: 'medium',
      createdAt: '2024-10-12T10:30:00.000Z',
      dueDate: '2024-12-31T23:59:59.000Z'
    },
    User: {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: '2024-10-12T10:30:00.000Z'
    },
    LoginRequest: {
      email: 'user@example.com',
      password: 'password123'
    },
    RegisterRequest: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }
  }
};

const outputFile = './src/config/swagger-output.json';
const endpointsFiles = [
  './src/routes/taskRouters.js',
  './src/routes/userRouters.js',
  './src/server.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
