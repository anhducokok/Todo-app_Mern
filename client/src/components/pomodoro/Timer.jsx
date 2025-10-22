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
  workMinutes = 1,
  breakMinutes = 5,
  autoStart = false,
  className = "",
}) {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isWork, setIsWork] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  
  // Theme hook - prefer resolvedTheme for accurate current theme ('light' | 'dark')
  const { resolvedTheme, setTheme } = useTheme();
  
  // Force re-render when theme changes
  useEffect(() => {
    console.log('Theme changed to:', resolvedTheme);
    setForceRender(prev => prev + 1); // Force component re-render
  }, [resolvedTheme]);
  
  // Settings state
  const [settings, setSettings] = useState({
    workMinutes: workMinutes,
    breakMinutes: breakMinutes,
    longBreakMinutes: 15,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartWork: false,
  });

  // const [tempSettings, setTempSettings] = useState(settings);
  const timerRef = useRef(null);

  // Reset when mode changes
  useEffect(() => {
    setSecondsLeft(
      isWork ? settings.workMinutes * 60 : settings.breakMinutes * 60
    );
  }, [isWork, settings.workMinutes, settings.breakMinutes]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsWork((w) => !w); // toggle mode
          setIsRunning(false); // auto-pause at switch
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleStartPause = () => setIsRunning((r) => !r);

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setSecondsLeft(
      isWork ? settings.workMinutes * 60 : settings.breakMinutes * 60
    );
  }; 
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSettingsOpen = () => {
    setTempSettings({ ...settings });
    setShowSettings(true);
  };
       const handleSettingsClose = () => {
    setShowSettings(false);
    setTempSettings(settings); // Reset temp settings
  };
 
  const handleSettingsSave = () => {
    setSettings({ ...tempSettings });
    setShowSettings(false);
    // Reset timer with new settings
    clearInterval(timerRef.current);
    setIsRunning(false);
    setSecondsLeft(
      isWork ? tempSettings.workMinutes * 60 : tempSettings.breakMinutes * 60
    );
  };

  const handleTempSettingChange = (key, value) => {
    setTempSettings((prev) => ({
      ...prev,
      [key]: parseInt(value) || 0,
    }));
  };
  const modeLabel = isWork ? "Work" : "Break";
  
  // Theme-aware gradient styles using CSS variables and theme detection
  const getGradientStyle = () => {
    const isDark = resolvedTheme === 'dark';
    
    if (isWork) {
      return {
        background: isDark 
          ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f97316 100%) !important' // darker reds/oranges for dark mode
          : 'linear-gradient(135deg, #ef4444 0%, #f97316 100%) !important' // bright reds/oranges for light mode
      };
    } else {
      return {
        background: isDark
          ? 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #047857 100%) !important' // deeper greens for dark mode
          : 'linear-gradient(135deg, #22c55e 0%, #10b981 100%) !important' // bright greens for light mode
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
              {modeLabel} Time
            </div>
            <div className="text-6xl font-mono">
              {pad(minutes)}:{pad(seconds)}
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 mt-3 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{
                  width: `${(
                    (1 -
                      secondsLeft /
                        ((isWork
                          ? settings.workMinutes
                          : settings.breakMinutes) *
                          60)) *
                    100
                  ).toFixed(1)}%`,
                }}
              />
            </div>

            <div className=" space-x-4 mt-4">
              <button
                onClick={handleStartPause}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>

            <div className="text-sm text-white/80 mt-2">
              {isWork
                ? `${settings.workMinutes}-minute focus session`
                : `${settings.breakMinutes}-minute break`}
            </div>
          </div>
          <div className="flex justify-end mb-2 gap-2">
            <Button
              onClick={handleSettingsOpen}
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
              
            >
              {resolvedTheme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>
      {showSettings && (
        <SettingLayout
          settings={settings}
          onClose={handleSettingsClose}
          onSave={handleSettingsSave}
          onTempChange={handleTempSettingChange}
        />
      )}
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
