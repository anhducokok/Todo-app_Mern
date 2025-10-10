// import { now } from "mongoose";

import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const { filter = "today" , search = "" } = req.query;
    const now = new Date();
  let startDate;
  switch (filter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const mondayDate =
        now.getDate() - (now.getDate() - 1) - (now.getDay() == 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      // startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "all":
      startDate = null;
      break;
    default:
      startDate = new Date();
  }
  let query = {};
  if (search) {
    query.title = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
  }

  query = startDate ? { createdAt: { $gte: startDate }, ...query } : query;
  try {
    const result = await Task.aggregate([
        { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completedCount: [
            { $match: { status: "completed" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]
      ? result[0].activeCount[0].count
      : 0;
    const completedCount = result[0].completedCount[0]
      ? result[0].completedCount[0].count
      : 0;
    res.status(200).json({ tasks, activeCount, completedCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json({ message: "Tiêu đề nhiệm vụ không được để trống" });
    }
    const newTask = new Task({ title: title.trim(), priority });
    newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completed, priority } = req.body;
    const updateTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, status, completed, priority },
      { new: true }
    );
    if (!updateTask) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }
    res.status(200).json(updateTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
    }
    res.status(200).json({ message: "Xóa nhiệm vụ thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
