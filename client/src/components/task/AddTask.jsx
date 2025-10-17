import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddTask = ({ handleNewTaskAdded }) => {
  const [taskTitle, setTaskTitle] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false); // Thêm loading state
  const [priority, setPriority] = React.useState("low"); // Thêm state cho priority
  const { token, isLoggedIn } = useAuth();

  const addTask = async () => {
    if (!isLoggedIn || !token) {
      toast.error("Please log in to add tasks");
      return;
    }

    if (taskTitle.trim()) {
      const taskTitleToAdd = taskTitle.trim();
      setIsLoading(true);
      
      // Optimistic update: clear input ngay lập tức
      setTaskTitle("");
      
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.post("http://localhost:5001/api/tasks", {
          title: taskTitleToAdd,
          priority,
        }, config);
        
        toast.success(`Thêm task "${taskTitleToAdd}" thành công`);
        handleNewTaskAdded(); // reload task list
      } catch (error) {
        // Nếu lỗi, khôi phục lại title
        setTaskTitle(taskTitleToAdd);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Thêm task thất bại");
        }
        console.error("Lỗi khi thêm task", error);
      } finally {
        setIsLoading(false); // Đảm bảo reset loading state
      }
    } else {
      toast.error("Tiêu đề nhiệm vụ không được để trống");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !isLoading) {
  //     e.preventDefault(); // Ngăn form submit
  //     addTask();
  //   }
  // };

  // Thêm optimistic update để UI responsive hơn
  const handleButtonClick = () => {
    if (!isLoading) {
      addTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className={cn("flex flex-col gap-3 sm:flex-row", "font-sans")}>
        <Input
          type="text"
          placeholder="Add a new task..."
            className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50
          focus:border-primary/50 focus:ring-primary/20"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyPress={(e) => {
            handleKeyPress(e);
          }}
          disabled={isLoading} // Disable input khi đang loading
        />
        {/* Select option for priority */}
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger
            className="h-12 text-base bg-slate-50 border border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-md px-4 sm:w-[140px] w-full transition-all duration-200"
            disabled={isLoading}
            aria-label="Priority"
            style={{ textTransform: "capitalize", height: "3rem" }}

          >
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="gradient"
          size="xl"
          className="px-6 mt-4 sm:mt-0 sm:ml-4 transition-all duration-200" // Thêm smooth transition
          onClick={handleButtonClick}
          disabled={isLoading} // Disable khi đang loading
        >
          <Plus className={`size-5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Đang thêm..." : "Thêm"}
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
