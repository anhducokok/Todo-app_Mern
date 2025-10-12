import express from "express";
import taskRoutes from "./routes/taskRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import userRoutes from "./routes/userRouters.js"; // Commented out - file doesn't exist yet

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Load swagger document
let swaggerDocument;
try {
  const swaggerPath = path.join(process.cwd(), 'src', 'config', 'swagger-output.json');
  const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
  swaggerDocument = JSON.parse(swaggerFile);
  console.log('✅ Swagger documentation loaded successfully');
} catch (error) {
  console.warn('⚠️  Swagger documentation not found. Run "npm run docs:generate" to create it.');
  console.warn('Error:', error.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "http://localhost:5173"}));

// Setup Swagger UI only if document is loaded
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Task Management API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
    }
  }));
  
  // Raw swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument);
  });
}

app.get("/", (req, res) => {
  /* 
    #swagger.tags = ['Health']
    #swagger.summary = 'Health check'
    #swagger.description = 'Basic health check endpoint'
    #swagger.responses[200] = {
      description: 'Server is running',
      schema: {
        type: 'string',
        example: 'Hello, World!'
      }
    }
  */
  res.send("Hello, World!");
});

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes); // Commented out - userRoutes file doesn't exist yet
app.use("/api/health", (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    if (swaggerDocument) {
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    } else {
      console.log(`📚 To generate API docs, run: npm run docs:generate`);
    }
  });
});
