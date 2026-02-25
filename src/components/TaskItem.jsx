import React, { useState, useEffect } from 'react';
import './TaskItem.css';

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const isToday = (dateStr) => {
  return dateStr === getTodayStr();
};

function TaskItem({ task, tasks, setTasks, mode }) {
  const [displayTime, setDisplayTime] = useState(task.totalTime);

  useEffect(() => {
    if (task.isRunning) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - task.lastStartedAt;
        setDisplayTime(task.totalTime + elapsed);
      }, 10); // Update every 10ms for milliseconds
      return () => clearInterval(interval);
    } else {
      setDisplayTime(task.totalTime);
    }
  }, [task.isRunning, task.totalTime, task.lastStartedAt]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10); // Get centiseconds (00-99)
    return {
      time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      ms: String(milliseconds).padStart(2, '0')
    };
  };

  const handleStart = () => {
    if (mode !== 'today' || !isToday(task.date)) return;
    
    setTasks(tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, isRunning: true, lastStartedAt: Date.now() };
      } else if (t.isRunning) {
        const elapsed = Date.now() - t.lastStartedAt;
        const cycle = {
          startTime: t.lastStartedAt,
          endTime: Date.now(),
          duration: Math.floor(elapsed / 1000)
        };
        return { 
          ...t, 
          isRunning: false, 
          totalTime: t.totalTime + elapsed, 
          lastStartedAt: null,
          cycles: [...(t.cycles || []), cycle]
        };
      }
      return t;
    }));
  };

  const handleStop = () => {
    if (!isToday(task.date)) return;
    const elapsed = Date.now() - task.lastStartedAt;
    const newTotalTime = task.totalTime + elapsed;
    
    setTasks(tasks.map(t => 
      t.id === task.id 
        ? { 
            ...t, 
            isRunning: false, 
            totalTime: newTotalTime, 
            lastStartedAt: null,
            cycles: [...(t.cycles || []), {
              startTime: task.lastStartedAt,
              endTime: Date.now(),
              duration: Math.floor(elapsed / 1000)
            }]
          }
        : t
    ));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.name}"?`)) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
  };

  const { time, ms } = formatTime(displayTime);

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-name">{task.name}</div>
        <button className="delete-btn" onClick={handleDelete}>del</button>
      </div>
      
      <div className="timer-box">
        <div className="timer-main">{time}</div>
        <div className="timer-ms">{ms}</div>
      </div>
      
      <div className="button-stack">
        <button 
          className="action-btn start-btn" 
          onClick={handleStart}
          disabled={task.isRunning || mode !== 'today'}
        >
          Start
        </button>
        <button 
          className="action-btn stop-btn" 
          onClick={handleStop}
          disabled={!task.isRunning || mode !== 'today'}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
