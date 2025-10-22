/*
Pomodoro Countdown Clock React Component
- Implements a standard Pomodoro timer: 25 min work / 5 min break cycles
- User can start, pause, and reset the timer
- Automatically switches between work and break modes
- Tailwind CSS styled and accessible

Example usage:
< PomodoroClock />
*/

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Moon, Palette, Settings, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import SettingLayout from "./SettingLayout";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Timer({
  workMinutes = 25,
  breakMinutes = 5,
  autoStart = false,
  className = "",
}) {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isWork, setIsWork] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [cyclesSinceLastLongBreak, setCyclesSinceLastLongBreak] = useState(0);
  
  // Theme hook - prefer resolvedTheme for accurate current theme ('light' | 'dark')
  const { resolvedTheme, setTheme } = useTheme();
  
  // Force re-render when theme changes
  useEffect(() => {
    console.log('Theme changed to:', resolvedTheme);
    setForceRender(prev => prev + 1); // Force component re-render
  }, [resolvedTheme]);
  
  // Load settings and stats from localStorage
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      workMinutes: workMinutes,
      breakMinutes: breakMinutes,
      longBreakMinutes: 15,
      soundEnabled: true,
      autoStartBreaks: false,
      autoStartWork: false,
      cyclesForLongBreak: 4,
    };
  });

  // Load completed cycles from localStorage and check for new day
  useEffect(() => {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('pomodoroLastReset');
    
    // Reset daily cycles if it's a new day
    if (lastResetDate !== today) {
      localStorage.setItem('pomodoroCycles', '0');
      localStorage.setItem('pomodoroLastReset', today);
      setCompletedCycles(0);
    } else {
      const savedCycles = localStorage.getItem('pomodoroCycles');
      if (savedCycles) setCompletedCycles(parseInt(savedCycles));
    }
    
    const savedCyclesSinceLong = localStorage.getItem('pomodoroLastLongBreak');
    if (savedCyclesSinceLong) setCyclesSinceLastLongBreak(parseInt(savedCyclesSinceLong));
  }, []);

  // const [tempSettings, setTempSettings] = useState(settings);
  const timerRef = useRef(null);

  // Reset when mode changes
  useEffect(() => {
    // Check if it's time for long break
    const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
    const duration = isWork 
      ? settings.workMinutes * 60 
      : isLongBreakTime 
        ? settings.longBreakMinutes * 60 
        : settings.breakMinutes * 60;
        
    setSecondsLeft(duration);
  }, [isWork, settings.workMinutes, settings.breakMinutes, settings.longBreakMinutes, cyclesSinceLastLongBreak, settings.cyclesForLongBreak]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Sound notification function
  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBz2U4/TSfC0EKoHN8aeS');
      audio.play().catch(e => console.log('Could not play sound:', e));
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          
          // Play notification sound
          if (settings.soundEnabled) {
            playNotificationSound();
          }
          
          // Handle cycle completion
          if (isWork) {
            const newCompletedCycles = completedCycles + 1;
            const newCyclesSinceLong = cyclesSinceLastLongBreak + 1;
            
            setCompletedCycles(newCompletedCycles);
            setCyclesSinceLastLongBreak(newCyclesSinceLong);
            
            // Save daily cycles
            localStorage.setItem('pomodoroCycles', newCompletedCycles.toString());
            localStorage.setItem('pomodoroLastLongBreak', newCyclesSinceLong.toString());
            
            // Update total cycles
            const totalCycles = parseInt(localStorage.getItem('totalPomodoroCycles') || '0') + 1;
            localStorage.setItem('totalPomodoroCycles', totalCycles.toString());
            
            // Update last session date and streak
            const today = new Date().toDateString();
            const lastSession = localStorage.getItem('lastPomodoroSession');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastSession !== today) {
              localStorage.setItem('lastPomodoroSession', today);
              
              // Update streak
              if (lastSession === yesterday.toDateString()) {
                const streak = parseInt(localStorage.getItem('pomodoroStreak') || '0') + 1;
                localStorage.setItem('pomodoroStreak', streak.toString());
              } else if (!lastSession) {
                localStorage.setItem('pomodoroStreak', '1');
              } else {
                localStorage.setItem('pomodoroStreak', '1'); // Reset streak
              }
            }
            
            // Show notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Pomodoro Complete!', {
                body: `Great job! You've completed ${newCompletedCycles} cycles today.`,
                icon: '/pomodoro-icon.png'
              });
            }
          }
          
          // Determine next mode (work, short break, or long break)
          let nextMode = !isWork;
          if (!isWork) {
            // Finishing a break, next is work
            nextMode = true;
          } else {
            // Finishing work, check if it's time for long break
            if (cyclesSinceLastLongBreak >= settings.cyclesForLongBreak) {
              setCyclesSinceLastLongBreak(0);
              localStorage.setItem('pomodoroLastLongBreak', '0');
              // Will be long break
            }
            nextMode = false;
          }
          
          setIsWork(nextMode);
          
          // Auto-start if enabled
          const shouldAutoStart = nextMode ? settings.autoStartWork : settings.autoStartBreaks;
          setIsRunning(shouldAutoStart);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, settings.soundEnabled, settings.autoStartBreaks, settings.autoStartWork, isWork, completedCycles, cyclesSinceLastLongBreak, settings.cyclesForLongBreak]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleStartPause = () => setIsRunning((r) => !r);

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
    const duration = isWork 
      ? settings.workMinutes * 60 
      : isLongBreakTime 
        ? settings.longBreakMinutes * 60 
        : settings.breakMinutes * 60;
    setSecondsLeft(duration);
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsWork(prev => !prev);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Save to localStorage
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    // Reset timer with new settings
    clearInterval(timerRef.current);
    setIsRunning(false);
    const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= newSettings.cyclesForLongBreak;
    const duration = isWork 
      ? newSettings.workMinutes * 60 
      : isLongBreakTime 
        ? newSettings.longBreakMinutes * 60 
        : newSettings.breakMinutes * 60;
    setSecondsLeft(duration);
  };
  const getModeLabel = () => {
    if (isWork) return "Work";
    const isLongBreakTime = cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
    return isLongBreakTime ? "Long Break" : "Break";
  };
  
  // Theme-aware gradient styles using CSS variables and theme detection
  const getGradientStyle = () => {
    const isDark = resolvedTheme === 'dark';
    const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
    
    if (isWork) {
      return {
        background: isDark 
          ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f97316 100%) !important'
          : 'linear-gradient(135deg, #ef4444 0%, #f97316 100%) !important'
      };
    } else if (isLongBreakTime) {
      return {
        background: isDark
          ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%) !important' // Purple for long break
          : 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%) !important'
      };
    } else {
      return {
        background: isDark
          ? 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #047857 100%) !important'
          : 'linear-gradient(135deg, #22c55e 0%, #10b981 100%) !important'
      };
    }
  };

  // Alternative: CSS class approach for better performance
  const getTimerClasses = () => {
    const baseClasses = "flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl shadow-lg text-white w-72 m-4 transition-all duration-500";
    const themeClasses = resolvedTheme === 'dark' ? 'timer-dark' : 'timer-light';
    const modeClasses = isWork ? 'timer-work' : 'timer-break';
    return `${baseClasses} ${themeClasses} ${modeClasses}`;
  };

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer group p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-~fade-in "
        )}
      >
        <div className="justify-center items-center justify-items-center">
          <div
            key={`timer-${resolvedTheme}-${isWork}-${forceRender}`}
            className={getTimerClasses()}
            style={getGradientStyle()}
          >
            <div className="text-xl font-semibold tracking-wide">
              {getModeLabel()} Time
            </div>
            <div className="text-6xl font-mono">
              {pad(minutes)}:{pad(seconds)}
            </div>
            
            {/* Cycles counter */}
            <div className="text-sm text-white/80 mb-2">
              Completed: {completedCycles} cycles | Next long break: {settings.cyclesForLongBreak - cyclesSinceLastLongBreak} cycles
            </div>
            
            <div className="w-full bg-white/30 rounded-full h-3 mt-3 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{
                  width: `${(() => {
                    const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
                    const totalDuration = isWork
                      ? settings.workMinutes * 60
                      : isLongBreakTime
                        ? settings.longBreakMinutes * 60
                        : settings.breakMinutes * 60;
                    return ((1 - secondsLeft / totalDuration) * 100).toFixed(1);
                  })()}%`,
                }}
              />
            </div>

            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleStartPause}
                className="px-6 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition flex-1"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition border border-white/30"
              >
                Reset
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition border border-white/30"
              >
                Skip
              </button>
            </div>

            <div className="text-sm text-white/80 mt-2 text-center">
              {(() => {
                const isLongBreakTime = !isWork && cyclesSinceLastLongBreak >= settings.cyclesForLongBreak;
                if (isWork) {
                  return `${settings.workMinutes}-minute focus session`;
                } else if (isLongBreakTime) {
                  return `${settings.longBreakMinutes}-minute long break`;
                } else {
                  return `${settings.breakMinutes}-minute break`;
                }
              })()}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">
              🍅 Pomodoro Timer
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
              </Button>
              {/* Button to change color themes */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              >
                {resolvedTheme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <SettingLayout
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        isWork={isWork}
        setSecondsLeft={setSecondsLeft}
        setIsRunning={setIsRunning}
        timerRef={timerRef}
      />
    </>
  );
}

/*
Extensions:
- Add sound notification when switching between modes
- Track completed Pomodoro cycles
- Allow custom durations via props or user input
- Store progress in localStorage
*/
