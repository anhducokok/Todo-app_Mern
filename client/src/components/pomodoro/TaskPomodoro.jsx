import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { Clock, CheckCircle, Circle, Play, Pause } from 'lucide-react';
import axios from 'axios';

const TaskPomodoro = ({ config }) => {
  const { user, isLoggedIn, token } = useAuth();
  
  // State for current task and timer
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [isTimerRunning, setIsTimerRunning] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds

  // Get task ID from URL params
  const taskId = new URLSearchParams(window.location.search).get('task');

  // Fetch task data on component mount
  useEffect(() => {
    if (taskId && isLoggedIn) {
      fetchTask(taskId);
    }
  }, [taskId, isLoggedIn]);

  const fetchTask = async (taskId) => {
    if (!isLoggedIn || !token) {
      console.log("No authentication token available");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:5001/api/tasks/${taskId}`, config);
      console.log("Fetched task:", response.data);
      setCurrentTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Failed to load task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading task...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">❌ Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchTask(taskId)} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // No task ID in URL
  if (!taskId) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Task Selected</h3>
            <p className="text-gray-600">
              Please select a task from your task list to start a Pomodoro session.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Task not found
  if (!currentTask && !loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">❓ Task Not Found</div>
            <p className="text-gray-600">
              The requested task could not be found or you don't have access to it.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* Task Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getPriorityColor(currentTask.priority)}`}></span>
                {currentTask.title}
              </h2>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant={currentTask.status === 'completed' ? 'default' : 'secondary'}>
                  {currentTask.status === 'completed' ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                  ) : (
                    <><Circle className="w-3 h-3 mr-1" /> Active</>
                  )}
                </Badge>
                
                <span className="capitalize">
                  {currentTask.priority} Priority
                </span>
                
                <span>
                  Created: {new Date(currentTask.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Task Description (if available) */}
          {currentTask.description && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {currentTask.description}
              </p>
            </div>
          )}
        </div>

        {/* Pomodoro Timer */}
       
       
        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Quick Actions:</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Mark Complete
              </Button>
              <Button size="sm" variant="outline">
                Edit Task
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskPomodoro;