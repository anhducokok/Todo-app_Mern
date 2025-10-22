// import { SourceTextModule } from "vm";
import Task from "../models/Task.js";
import mongoose from "mongoose";

class TaskRepository {
  // Find tasks with query
  async findTasks(query = {}) {
    return await Task.find(query).lean();
  }

  // Find tasks with aggregation
  async aggregateTasks(pipeline) {
    return await Task.aggregate(pipeline);
  }

  // Find single task
  async findOneTask(query) {
    return await Task.findOne(query).lean();
  }

  // Create new task
  async createTask(taskData) {
    return await Task.create(taskData);
  }

  // Update task
  async updateTask(query, updateData, options = {}) {
    return await Task.findOneAndUpdate(
      query,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        ...options
      }
    );
  }

  // Soft delete task
  async softDeleteTask(query) {
    return await Task.findOneAndUpdate(
      query,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  }

  // Hard delete task (if needed)
  async deleteTask(query) {
    return await Task.findOneAndDelete(query);
  }

  // Get tasks with stats using aggregation
  async getTasksWithStats(matchQuery, limit = 100) {
    console.log("Aggregation Match Query:", JSON.stringify(matchQuery, null, 2));
    return await Task.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          tasks: [
            { $sort: { createdAt: -1 } },
            { $limit: limit }
          ],
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                activeCount: {
                  $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                },
                completedCount: {
                  $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);
  }

  // Count documents
  async countTasks(query = {}) {
    return await Task.countDocuments(query);
  }

  // Check if task exists
  async taskExists(query) {
    return await Task.exists(query);
  }

  // Utility: Convert string ID to ObjectId
  toObjectId(id) {
     if (id && typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    return id;
  }

  // Utility: Build base query with common filters
  buildBaseQuery(userId = null, includeDeleted = false) {
    const query = {};
    
    if (userId) {
      query.userId = this.toObjectId(userId);
    }
    
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    
    return query;
  }

  // Utility: Build date filter
  buildDateFilter(filter) {
    const now = new Date();

    switch (filter) {
      case "today":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());

      case "week":
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - mondayOffset);
        monday.setHours(0, 0, 0, 0);
        return monday;

      case "month":
        return new Date(now.getFullYear(), now.getMonth(), 1);

      case "all":
        return null;

      default:
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
  }
}

export default new TaskRepository();