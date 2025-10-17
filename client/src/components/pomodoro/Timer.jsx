/*
Pomodoro Countdown Clock React Component
- Implements a standard Pomodoro timer: 25 min work / 5 min break cycles
- User can start, pause, and reset the timer
- Automatically switches between work and break modes
- Tailwind CSS styled and accessible

Example usage:
< PomodoroClock />
*/

import React, { useState, useEffect, useRef } from "react";

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
  const timerRef = useRef(null);

  // Reset when mode changes
  useEffect(() => {
    setSecondsLeft(isWork ? workMinutes * 60 : breakMinutes * 60);
  }, [isWork, workMinutes, breakMinutes]);

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
    setSecondsLeft(isWork ? workMinutes * 60 : breakMinutes * 60);
  };

  const modeLabel = isWork ? "Work" : "Break";
  const modeColor = isWork ? "from-red-500 to-orange-500" : "from-green-500 to-emerald-500";

  return (
    <div className="flex justify-between">
    <div
      className={`flex flex-col items-center justify-center space-y-4 p-6 rounded-2xl shadow-lg bg-gradient-to-br ${modeColor} text-white w-72 ${className} m-4`}
    >
      
      <div className="text-xl font-semibold tracking-wide">{modeLabel} Time</div>
      <div className="text-6xl font-mono">
        {pad(minutes)}:{pad(seconds)}
      </div>
       <div className="w-full bg-white/30 rounded-full h-3 mt-3 overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-500"
        style={{
          width: `${((1 - secondsLeft / ((isWork ? workMinutes : breakMinutes) * 60)) * 100).toFixed(1)}%`,
        }}
      />
    </div>

      <div className="flex space-x-4 mt-4">
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
        {isWork ? `${workMinutes}-minute focus session` : `${breakMinutes}-minute break`}
      </div>
      
    </div>
     <div className="bg-black w-1/4 aspect-square p-9 rounded-full ">
     
        <div className="flex flex-col items-center justify-center  aspect-square container mx-auto rounded-full bg-white">
          {/* Count-down Timer */}
          <div className="p-4 m-4">
            <span className="text-4xl font-mono text-black block">  {pad(minutes)}:{pad(seconds)}</span>
          </div>
          {/* Control Buttons */}
          <div className="space-x-4">
            <button className="btn bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white" onClick={handleStartPause}>
              {isRunning ? "Pause" : "Start"}
            </button>
            <button className="btn bg-red-500 hover:bg-red-700 p-3 rounded-lg text-white" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      </div>
  );
}

/*
Extensions:
- Add sound notification when switching between modes
- Track completed Pomodoro cycles
- Allow custom durations via props or user input
- Store progress in localStorage
*/
