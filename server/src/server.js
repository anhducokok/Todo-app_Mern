import express from "express";
import taskRoutes from "./routes/taskRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "http://localhost:5173"}));
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
