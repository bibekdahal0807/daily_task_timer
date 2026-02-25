import React, { useState } from 'react';
import './Analytics.css';

function Analytics({ tasks, selectedDate, mode }) {
  const [expandedTasks, setExpandedTasks] = useState({});

  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const totalCycles = filteredTasks.reduce((sum, task) => sum + (task.cycles?.length || 0), 0);
  const totalTime = filteredTasks.reduce((sum, task) => sum + (task.totalTime || 0), 0);

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  if (mode === 'future') {
    return (
      <div className="analytics-card">
        <h2 className="analytics-title">Daily Analytics</h2>
        <div className="analytics-empty">No data available.</div>
      </div>
    );
  }

  return (
    <div className="analytics-card">
      <h2 className="analytics-title">Daily Analytics</h2>
      
      <div className="analytics-summary">
        <div className="summary-item">
          <span className="summary-label">Total Tasks</span>
          <span className="summary-value">{filteredTasks.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Time</span>
          <span className="summary-value">{formatTime(totalTime)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Cycles</span>
          <span className="summary-value">{totalCycles}</span>
        </div>
      </div>

      <div className="analytics-tasks">
        {filteredTasks.map(task => {
          const cycles = task.cycles || [];
          const avgCycle = cycles.length > 0 ? (task.totalTime || 0) / cycles.length : 0;
          
          return (
            <div key={task.id} className="analytics-task">
              <div className="analytics-task-header" onClick={() => toggleTask(task.id)}>
                <span className="task-expand-icon">{expandedTasks[task.id] ? '▼' : '▶'}</span>
                <span className="analytics-task-name">{task.name}</span>
              </div>
              
              {expandedTasks[task.id] && (
                <div className="analytics-task-details">
                  <div className="detail-row">
                    <span className="detail-label">Total Time:</span>
                    <span className="detail-value">{formatTime(task.totalTime || 0)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Cycles:</span>
                    <span className="detail-value">{cycles.length}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Avg Cycle:</span>
                    <span className="detail-value">{formatTime(avgCycle)}</span>
                  </div>
                  
                  {cycles.length > 0 && (
                    <div className="cycles-list">
                      <div className="cycles-header">Cycle History</div>
                      {cycles.map((cycle, index) => (
                        <div key={index} className="cycle-item">
                          <span className="cycle-time">
                            {formatTimestamp(cycle.startTime)} → {formatTimestamp(cycle.endTime)}
                          </span>
                          <span className="cycle-duration">{formatTime(cycle.duration * 1000)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Analytics;
