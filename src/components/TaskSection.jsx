import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { supabase } from '../supabase';
import './TaskSection.css';

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const isToday = (dateStr) => {
  return dateStr === getTodayStr();
};

function TaskSection({ tasks, setTasks, mode, selectedDate, currentUserId }) {
  const [showInput, setShowInput] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const filteredTasks = tasks.filter(task => task.date === selectedDate);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    return filteredTasks.reduce((total, task) => {
      let taskTime = task.totalTime;
      if (task.isRunning) {
        taskTime += Date.now() - task.lastStartedAt;
      }
      return total + taskTime;
    }, 0);
  };

  const addTask = async () => {
    if (!isToday(selectedDate)) {
      return;
    }
    if (taskInput.trim()) {
      const newTask = {
        id: crypto.randomUUID(),
        name: taskInput,
        date: selectedDate,
        totalTime: 0,
        isRunning: false,
        lastStartedAt: null,
        cycles: []
      };
      
      const { error } = await supabase
        .from('tasks')
        .insert([{
          id: newTask.id,
          name: newTask.name,
          date: newTask.date,
          total_time: 0,
          cycles: [],
          user_id: currentUserId
        }]);
      
      if (error) {
        console.error('Error adding task:', error.message);
      } else {
        setTasks([...tasks, newTask]);
        setTaskInput('');
        setShowInput(false);
      }
    }
  };

  return (
    <div className="task-section">
      <div className="task-section-header">
        <h2 className="task-section-title">Tasks</h2>
        {mode === 'today' && !showInput && (
          <button className="add-button-top" onClick={() => setShowInput(true)}>
            + Add Task
          </button>
        )}
      </div>

      {mode === 'today' && showInput && (
        <div className="task-input-container">
          <input
            type="text"
            className="task-input"
            placeholder="Enter task name..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            autoFocus
          />
          <button className="add-button" onClick={addTask}>Add</button>
          <button className="cancel-button" onClick={() => {
            setShowInput(false);
            setTaskInput('');
          }}>Cancel</button>
        </div>
      )}
      
      <div className="task-list">
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} tasks={tasks} setTasks={setTasks} mode={mode} currentUserId={currentUserId} />
        ))}
      </div>

      {filteredTasks.length > 0 && (
        <div className="total-time">
          Total Time Today: {formatTime(getTotalTime())}
        </div>
      )}
    </div>
  );
}

export default TaskSection;
