import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "../ui/badge";

/**
 * TaskCard component - Hiển thị thông tin một task dưới dạng card
 * @param {Object} task - Object chứa thông tin task (title, status, createdAt, completedAt)
 * @param {number} index - Vị trí của task trong danh sách (dùng cho animation delay)
 */
const TaskCard = ({ task, index, handleTaskChanged,config }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [updateTask, setUpdateTask] = React.useState(task.title || "");
  // const { token } = useAuth();

  
  // ham updateTask dder goi api update task
  const updateTasks = async () => {
    try {
      setIsEditing(false);
      await axios.put(`http://localhost:5001/api/tasks/${task._id}`, {
        title: updateTask,
      }, config);
      handleTaskChanged(); // reload task list
      toast.success("Cập nhật task thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật task", error);
      toast.error("Cập nhật task thất bại");
    }
  };
  const handleCheckboxClick = async () => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${task._id}`, {
        status: task.status === "active" ? "completed" : "active",
        completed: task.status === "active" ? new Date() : null,
      }, config);
      handleTaskChanged();
      toast.success("Cập nhật task thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật task", error);
      toast.error("Cập nhật task thất bại");
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${task._id}`, config);
      handleTaskChanged();
      toast.success("Xóa task thành công");
    } catch (error) {
      console.error("Lỗi khi xóa task", error);
      toast.error("Xóa task thất bại");
    }
  };

  // Hàm lưu thay đổi và tắt chế độ edit
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateTasks();
    }
  };

  return (
    // the Card field have more hightlight than the background
    <Card
      className={cn(
        "cursor-pointer group p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-~fade-in ",
        task.status === "completed" ? "opacity-70" : "opacity-100"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      // Navigate to task pomodoro page when click card
      onClick={() => {
        window.location.href = `/Pomodoro?task=${task._id}`;
      }}
    >
      
      {/* Flexbox container chính */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleCheckboxClick}
          variant="ghost"
          size="icon"
          className={cn(
            // "flex-shrink-0" - không cho phép element này co lại
            // "size-8" - width và height = 2rem (32px)
            // "rounded-full" - border-radius: 9999px (tạo hình tròn hoàn hảo)
            // "transition-all duration-200" - smooth transition cho tất cả properties
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            // Conditional styling dựa trên status
            task.status === "completed"
              ? "text-success hover:text-success/80" // Màu xanh khi completed
              : "text-muted-foreground hover:text-primary" // Màu xám khi active
          )}
        >
          {/* Conditional rendering icon dựa trên status */}
          {task.status === "completed" ? (
            <CheckCircle2 className="size-4" /> // Icon tích xanh
          ) : (
            <Circle className="size-4" /> // Icon vòng tròn rỗng
          )}
        </Button>

        {/* Container cho title và date */}
        <div className="flex-1 min-w-0">
          {/* Conditional rendering: hiển thị Input hoặc paragraph */}
          {isEditing ? (
            <Input
              placeholder="Cần phải làm gì"
              className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 text-foreground"
              value={updateTask}
              onChange={(e) => setUpdateTask(e.target.value)}
              onKeyPress={handleKeyPress} // Lưu khi nhấn Enter
              onBlur={(e)=>{
                setIsEditing(false);
                setUpdateTask(task.title||"");
              }}
            />
          ) : (
            <p
              className={cn(
                "flex-1 text-left text-foreground",
                // Conditional: nếu completed thì có line-through
                task.status === "completed" ? "line-through" : ""
              )}
            >
              {task.title}
            </p>
          )}

          {/* Container hiển thị ngày tháng */}
          <div className="flex item-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString("en-GB")}
            </span>

            {/* Conditional rendering: chỉ hiển thị ngày hoàn thành nếu có */}
            {task.completed && (
              <>
                <span className="text-xs text-muted-foreground"> | </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completed).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
          {/* Hiển thị priority */}
         
          <div className="flex item-center gap-2 mt-1">
            {/* //  1 border và background đỏ vàng xanh tùy theo priority */}
            {task.priority === "high" && (
              <Badge
                variant="destructive"
                className="bg-white/50 text-red-500 border-red-500/20"
              >
              {/* <span className="text-xs text-muted-foreground ">Priority: </span> */}
              {task.priority.toUpperCase()}
            </Badge>

          )}
            {task.priority === "medium" && (
              <Badge
                variant="outline"
                className="bg-white/50 text-yellow-500 border-yellow-500/20"
              >
              {/* <span className="text-xs text-muted-foreground ">Priority: </span> */}
              {task.priority.toUpperCase()}
            </Badge>
          )}
            {task.priority === "low" && (
              <Badge
                variant="secondary"
                className="bg-white/50 text-success border-success/20"
              >
              {/* <span className="text-xs text-muted-foreground ">Priority: </span> */}
              {task.priority.toUpperCase()}
            </Badge>
          )}
          </div>

        </div>
        

        {/* Container cho các nút action (Edit & Delete) */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info "
            onClick={() => {
              setIsEditing(true);
              setUpdateTask(task.title);
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Nút Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            {/* "hover:text-destructive" - đổi màu đỏ (destructive) khi hover */}
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      
  </Card>
);
};

export default TaskCard;
