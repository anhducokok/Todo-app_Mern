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
  
  // Theme hook - useTheme returns an object, not an array
  const { theme, setTheme } = useTheme();
  // Settings state
  const [settings, setSettings] = useState({
    workMinutes: workMinutes,
    breakMinutes: breakMinutes,
    longBreakMinutes: 15,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartWork: false,
  });

  const [tempSettings, setTempSettings] = useState(settings);
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
  
  // Theme-aware colors
  const getModeColors = () => {
    if (isWork) {
      return theme === 'dark' 
        ? "from-red-600 via-red-500 to-orange-600 dark:from-red-500 dark:to-orange-500" 
        : "from-red-500 to-orange-500";
    } else {
      return theme === 'dark' 
        ? "from-green-600 via-emerald-500 to-green-600 dark:from-green-500 dark:to-emerald-500" 
        : "from-green-500 to-emerald-500";
    }
  };
  
  const modeColor = getModeColors();

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer group p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-~fade-in "
        )}
      >
        <div className="justify-center items-center justify-items-center">
          <div
            className={`flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl shadow-lg bg-gradient-to-br ${modeColor} text-white w-72 ${className} m-4`}
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
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Settings Popup */}
      {showSettings && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <Card className="w-96 max-w-md mx-4 bg-background border border-border">
            <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">⚙️ Timer Settings</h2>
              <Button
                onClick={handleSettingsClose}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>              {/* Settings Form */}
              <div className="space-y-4">
                {/* Work Duration */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    🍅 Work Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.workMinutes}
                    onChange={(e) =>
                      handleTempSettingChange("workMinutes", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                {/* Break Duration */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ☕ Short Break (minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={tempSettings.breakMinutes}
                    onChange={(e) =>
                      handleTempSettingChange("breakMinutes", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                {/* Long Break Duration */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    🛋️ Long Break (minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.longBreakMinutes}
                    onChange={(e) =>
                      handleTempSettingChange(
                        "longBreakMinutes",
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Checkboxes for future features */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={tempSettings.soundEnabled}
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          soundEnabled: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <span>🔔 Sound notifications</span>
                  </label>

                  <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={tempSettings.autoStartBreaks}
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          autoStartBreaks: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <span>🚀 Auto-start breaks</span>
                  </label>

                  <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={tempSettings.autoStartWork}
                      onChange={(e) =>
                        setTempSettings((prev) => ({
                          ...prev,
                          autoStartWork: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <span>⚡ Auto-start work sessions</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <Button onClick={handleSettingsClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={handleSettingsSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
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
