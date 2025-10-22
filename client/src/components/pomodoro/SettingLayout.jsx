import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { X } from 'lucide-react';
import { Input } from '../ui/input';

const SettingLayout = ( workMinutes = 1,
  breakMinutes = 5,
  autoStart = false) => {
     const [showSettings, setShowSettings] = useState(false);
    //   const [forceRender, setForceRender] = useState(0);
       const handleSettingsClose = () => {
    setShowSettings(false);
    setTempSettings(settings); // Reset temp settings
  };
    const [settings, setSettings] = useState({
      workMinutes: workMinutes,
      breakMinutes: breakMinutes,
      longBreakMinutes: 15,
      soundEnabled: true,
      autoStartBreaks: false,
      autoStartWork: false,
    });
  const [tempSettings, setTempSettings] = useState(settings);
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
  return (
    <div>
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
        </div>
  )
}

export default SettingLayout