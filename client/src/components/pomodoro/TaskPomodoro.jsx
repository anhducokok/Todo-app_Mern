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

  const handleMarkComplete = async () => {
    if (!currentTask || currentTask.status === 'completed') return;
    
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5001/api/tasks/${currentTask._id}`,
        { ...currentTask, status: 'completed' },
        config
      );
      
      setCurrentTask(response.data);
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Completed!', {
          body: `Great job! "${currentTask.title}" has been marked as complete.`,
          icon: '/task-icon.png'
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
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

  // No task ID in URL - show task selector
  if (!taskId) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-4">No Task Selected</h3>
          <p className="text-gray-600 mb-6">
            Start a focused Pomodoro session by selecting a task, or work on a general focus session.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.open('/tasks', '_blank')} 
              className="w-full"
            >
              📋 Select Task from List
            </Button>
            
            <div className="text-sm text-gray-500 my-4">or</div>
            
            <Button 
              variant="outline"
              onClick={() => {
                // Start general focus session
                const url = new URL(window.location);
                url.searchParams.set('task', 'general');
                window.history.replaceState({}, '', url);
                setCurrentTask({
                  _id: 'general',
                  title: 'General Focus Session',
                  description: 'Focus on your current work without a specific task',
                  priority: 'medium',
                  status: 'active',
                  createdAt: new Date().toISOString(),
                });
              }}
              className="w-full"
            >
              🎯 Start General Focus Session
            </Button>
          </div>
        </div>
      </Card>
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

        {/* Task Progress */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              🍅 Pomodoro Progress
            </h3>
            <Badge variant="outline" className="text-blue-700 dark:text-blue-300">
              Active Session
            </Badge>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Focus on this task during your Pomodoro session. Stay concentrated and avoid distractions!
          </p>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-600 dark:text-blue-400">Today's Focus:</span>
              <div className="font-medium">
                {localStorage.getItem('pomodoroCycles') || 0} cycles completed
              </div>
            </div>
            <div>
              <span className="text-blue-600 dark:text-blue-400">Estimated Time:</span>
              <div className="font-medium">
                {currentTask.estimatedHours || 'Not set'} hours
              </div>
            </div>
          </div>
        </div>
       
        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Quick Actions:</span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleMarkComplete()}
                disabled={loading}
              >
                {currentTask.status === 'completed' ? 'Completed ✓' : 'Mark Complete'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Back to Tasks
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskPomodoro;