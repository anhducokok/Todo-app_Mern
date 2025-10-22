import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';

const PomodoroStats = () => {
  const [stats, setStats] = useState({
    todaysCycles: 0,
    totalCycles: 0,
    streak: 0,
    avgCyclesPerDay: 0,
    lastSessionDate: null,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Load from localStorage
    const todaysCycles = parseInt(localStorage.getItem('pomodoroCycles') || '0');
    const totalCycles = parseInt(localStorage.getItem('totalPomodoroCycles') || '0');
    const streak = parseInt(localStorage.getItem('pomodoroStreak') || '0');
    const lastSessionDate = localStorage.getItem('lastPomodoroSession');
    
    // Calculate average (simplified)
    const avgCyclesPerDay = totalCycles > 0 ? Math.round(totalCycles / Math.max(streak, 1)) : 0;

    setStats({
      todaysCycles,
      totalCycles,
      streak,
      avgCyclesPerDay,
      lastSessionDate,
    });
  };

  const getStreakBadgeColor = (streak) => {
    if (streak >= 7) return 'bg-green-500';
    if (streak >= 3) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Your Pomodoro Stats
        </h3>
        <Badge className={`text-white ${getStreakBadgeColor(stats.streak)}`}>
          {stats.streak} day streak
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Cycles */}
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {stats.todaysCycles}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Today's Focus
          </div>
        </div>

        {/* Total Cycles */}
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {stats.totalCycles}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Total Sessions
          </div>
        </div>

        {/* Average per Day */}
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {stats.avgCyclesPerDay}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">
            Daily Average
          </div>
        </div>

        {/* Streak */}
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {stats.streak}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">
            Day Streak
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stats.todaysCycles === 0 && "Ready to start your focus session? 🍅"}
          {stats.todaysCycles === 1 && "Great start! Keep the momentum going! 💪"}
          {stats.todaysCycles >= 2 && stats.todaysCycles < 4 && "You're on fire! Excellent progress! 🔥"}
          {stats.todaysCycles >= 4 && "Outstanding dedication! You're crushing it today! 🎉"}
        </p>
      </div>
    </Card>
  );
};

export default PomodoroStats;