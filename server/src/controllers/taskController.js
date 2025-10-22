import taskService from "../services/taskService.js";

export const getTasks = async (req, res) => {
  try {
    const { filter = "today", search = ""} = req.query;
    const userId = req.user?.id; // Get from auth middleware (optional for now)

    const result = await taskService.getTasksWithStats(filter, search, userId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getTasks controller:", error);
    res.status(500).json({ 
      message: error.message || "Lỗi hệ thống" 
    });
  }
};
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get from auth middleware (optional for now)
    const task = await taskService.getTaskById(id, userId);

    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById controller:", error);
    res.status(500).json({
      message: error.message || "Lỗi hệ thống"
    });
  }
};
export const createTask = async (req, res) => {
  try {
    const { title, priority } = req.body;
    const userId = req.user?.id; // Get from auth middleware (optional for now)

    const newTask = await taskService.createTask({ title, priority }, userId);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error in createTask controller:", error);
    
    // Handle validation errors vs system errors
    if (error.message.includes("không được để trống") || 
        error.message.includes("ít nhất") || 
        error.message.includes("không hợp lệ")) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: error.message || "Lỗi hệ thống" 
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, priority } = req.body;
    const userId = req.user?.id; // Get from auth middleware (optional for now)

    const updatedTask = await taskService.updateTask(
      id, 
      { title, status, priority }, 
      userId
    );
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error in updateTask controller:", error);
    
    // Handle not found vs validation vs system errors
    if (error.message.includes("Không tìm thấy") || 
        error.message.includes("không có quyền")) {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes("không được để trống") || 
        error.message.includes("không hợp lệ")) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: error.message || "Lỗi hệ thống" 
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get from auth middleware (optional for now)

    const result = await taskService.deleteTask(id, userId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    
    // Handle not found vs system errors
    if (error.message.includes("Không tìm thấy") || 
        error.message.includes("không có quyền")) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: error.message || "Lỗi hệ thống" 
    });
  }
};
