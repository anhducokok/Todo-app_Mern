import taskRepository from "../repositories/taskRepository.js";

class TaskService {
  // Build complete query object for tasks
  buildTaskQuery(filter, search, userId = null) {
    // Start with base query (includes userId and soft delete filter)
    let query = taskRepository.buildBaseQuery(userId, false);

    // Add search filter
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Add date filter
    const startDate = taskRepository.buildDateFilter(filter);
    if (startDate) {
      query.createdAt = { $gte: startDate };
    }

    return query;
  }

  // Get tasks with aggregation and stats - BUSINESS LOGIC ONLY
  async getTasksWithStats(filter = "today", search = "", userId = null) {
    try {
      const query = this.buildTaskQuery(filter, search, userId);
      
      console.log("Final Query:", JSON.stringify(query, null, 2));

      // Use repository to get data from database
      const result = await taskRepository.getTasksWithStats(query, 100);

      const stats = result[0].stats[0] || { activeCount: 0, completedCount: 0 };

      return {
        tasks: result[0].tasks || [],
        activeCount: stats.activeCount,
        completedCount: stats.completedCount,
      };
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  }

  // Create new task - BUSINESS LOGIC ONLY
  async createTask(taskData, userId = null) {
    try {
      const { title, priority = "low" } = taskData;

      // Business logic validation
      if (!title || title.trim() === "") {
        throw new Error("Tiêu đề nhiệm vụ không được để trống");
      }

      if (title.trim().length < 3) {
        throw new Error("Tiêu đề phải có ít nhất 3 ký tự");
      }

      if (title.length > 100) {
        throw new Error("Tiêu đề không được quá 100 ký tự");
      }

      const validPriorities = ["low", "medium", "high"];
      if (!validPriorities.includes(priority)) {
        throw new Error("Mức độ ưu tiên không hợp lệ");
      }

      // Prepare task object
      const taskObject = {
        title: title.trim(),
        priority,
        status: "active",
        isDeleted: false
      };

      // Add userId if provided (for authentication)
      if (userId) {
        taskObject.userId = taskRepository.toObjectId(userId);
      }

      // Use repository to create task
      const savedTask = await taskRepository.createTask(taskObject);

      return savedTask;
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  // Update existing task - BUSINESS LOGIC ONLY
  async updateTask(taskId, updateData, userId = null) {
    try {
      const { title, status, priority } = updateData;

      // Business logic validation and preparation
      const updateFields = { updatedAt: new Date() };

      if (title !== undefined) {
        if (!title || title.trim() === "") {
          throw new Error("Tiêu đề nhiệm vụ không được để trống");
        }
        if (title.trim().length < 3) {
          throw new Error("Tiêu đề phải có ít nhất 3 ký tự");
        }
        updateFields.title = title.trim();
      }

      if (status !== undefined) {
        const validStatuses = ["active", "completed"];
        if (!validStatuses.includes(status)) {
          throw new Error("Trạng thái không hợp lệ");
        }
        updateFields.status = status;

        if (status === "completed") {
          updateFields.completedAt = new Date();
        } else {
          updateFields.completedAt = null;
        }
      }

      if (priority !== undefined) {
        const validPriorities = ["low", "medium", "high"];
        if (!validPriorities.includes(priority)) {
          throw new Error("Mức độ ưu tiên không hợp lệ");
        }
        updateFields.priority = priority;
      }

      // Build find query using repository
      const findQuery = taskRepository.buildBaseQuery(userId, false);
      findQuery._id = taskRepository.toObjectId(taskId);

      // Use repository to update task
      const updatedTask = await taskRepository.updateTask(findQuery, updateFields);

      if (!updatedTask) {
        throw new Error(
          "Không tìm thấy nhiệm vụ hoặc bạn không có quyền cập nhật"
        );
      }

      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  // Delete task - BUSINESS LOGIC ONLY
  async deleteTask(taskId, userId = null) {
    try {
      // Build find query using repository
      const findQuery = taskRepository.buildBaseQuery(userId, false);
      findQuery._id = taskRepository.toObjectId(taskId);

      // Use repository to soft delete task
      const deletedTask = await taskRepository.softDeleteTask(findQuery);

      if (!deletedTask) {
        throw new Error("Không tìm thấy nhiệm vụ hoặc bạn không có quyền xóa");
      }

      return {
        message: "Xóa nhiệm vụ thành công",
        deletedTask,
      };
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  // Get task by ID - BUSINESS LOGIC ONLY
  async getTaskById(taskId, userId = null) {
    try {
      // Build find query using repository
      const findQuery = taskRepository.buildBaseQuery(userId, false);
      findQuery._id = taskRepository.toObjectId(taskId);

      // Use repository to find task
      const task = await taskRepository.findOneTask(findQuery);

      if (!task) {
        throw new Error("Không tìm thấy nhiệm vụ hoặc bạn không có quyền xem");
      }

      return task;
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }
  }
}

export default new TaskService();
