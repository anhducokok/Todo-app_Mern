import React from "react";
import { Card } from "../ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = ({ filter }) => {
  return (
    <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
      <div className="space-y-3">
        <Circle className="mx-auto size-12 text-muted-foreground" />
        <div>
          <h3 className="font-medium text-foreground/50">
            {filter === "active"
              ? "No active tasks"
              : filter === "completed"
              ? "No completed tasks"
              : "No tasks available"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {filter === "all"
              ? "You have no tasks at the moment."
              : filter === "active"
              ? "You have completed all your tasks. Great job!"
              : "You haven't completed any tasks yet. Start by adding a new task."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TaskEmptyState;
