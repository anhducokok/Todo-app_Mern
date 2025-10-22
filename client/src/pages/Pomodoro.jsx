import Navigator from "@/components/common/Navigator";
import TaskPomodoro from "@/components/pomodoro/TaskPomodoro";
import Timer from "@/components/pomodoro/Timer";
import PomodoroStats from "@/components/pomodoro/PomodoroStats";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

const Pomodoro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn, token } = useAuth();
  const config = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };
  const fetchTask = async () => {
    if (!token || !isLoggedIn) {
      console.log("No authentication token available");
      return;
    }
    try {
      setIsLoading(true); 
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
          <Spinner className="h-16 w-16 text-red-200 animate-spin" />
        </div>
      )}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 20%, #fdfdfd 60%, #eeeeee 100%)",
        }}
      />
      <div className="container pt-8 mx-auto relative z-10">
        <div className="max-w-2xl mx-auto">
          <Navigator />
          
          {/* Stats Section */}
          <div className="mt-6">
            <PomodoroStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Timer Section */}
            <div className="order-1 lg:order-1">
              <Timer />
            </div>
            {/* Task Section */}
            <div className="order-2 lg:order-2">
              <TaskPomodoro config={config} />
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
              🍅 Pomodoro Technique Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">During Work Sessions:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Focus on a single task</li>
                  <li>• Avoid distractions (phone, social media)</li>
                  <li>• Take notes of interrupting thoughts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">During Breaks:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Stand up and stretch</li>
                  <li>• Get some fresh air</li>
                  <li>• Avoid screens if possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
