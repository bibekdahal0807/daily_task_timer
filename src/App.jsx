import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TaskSection from './components/TaskSection';
import Analytics from './components/Analytics';
import { supabase } from './supabase';
import './App.css';

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const isToday = (dateStr) => {
  return dateStr === getTodayStr();
};

const isPast = (dateStr) => {
  return dateStr < getTodayStr();
};

const isFuture = (dateStr) => {
  return dateStr > getTodayStr();
};

const OWNER_SECRET = "murari-2026-focus";
const OWNER_ID = "murari-private";
const PUBLIC_ID = "public-demo";

function App() {
  const [currentDay, setCurrentDay] = useState(getTodayStr());
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const isOwner = params.get("owner") === OWNER_SECRET;
  const currentUserId = isOwner ? OWNER_ID : PUBLIC_ID;

  // Load tasks from Supabase on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', currentUserId)
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        const tasksList = (data || []).map(task => ({
          id: task.id,
          name: task.name,
          date: task.date,
          totalTime: (task.total_time || 0) * 1000,
          cycles: task.cycles || [],
          isRunning: false,
          lastStartedAt: null
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error('Error loading tasks:', error.message);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [currentUserId]);

  // Save tasks to Supabase whenever they change
  useEffect(() => {
    if (loading) return;
    
    const saveTasks = async () => {
      try {
        for (const task of tasks) {
          const { error } = await supabase
            .from('tasks')
            .upsert({
              id: task.id,
              name: task.name,
              date: task.date,
              total_time: Math.floor((task.totalTime || 0) / 1000),
              cycles: task.cycles || [],
              user_id: currentUserId
            }, { onConflict: 'id' });
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error saving tasks:', error.message);
      }
    };
    saveTasks();
  }, [tasks, loading, currentUserId]);

  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const newDay = getTodayStr();
      if (newDay !== currentDay) {
        setCurrentDay(newDay);
        if (selectedDate === currentDay) {
          setSelectedDate(newDay);
        }
      }
    }, 30000);
    return () => clearInterval(checkMidnight);
  }, [currentDay, selectedDate]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const updatedTasks = tasks.map(task => {
        if (task.isRunning) {
          const elapsed = Date.now() - task.lastStartedAt;
          return {
            ...task,
            totalTime: task.totalTime + elapsed,
            isRunning: false,
            lastStartedAt: null,
            cycles: [...(task.cycles || []), {
              startTime: task.lastStartedAt,
              endTime: Date.now(),
              duration: Math.floor(elapsed / 1000)
            }]
          };
        }
        return task;
      });
      
      try {
        for (const task of updatedTasks) {
          await supabase
            .from('tasks')
            .upsert({
              id: task.id,
              name: task.name,
              date: task.date,
              total_time: Math.floor(task.totalTime / 1000),
              cycles: task.cycles || [],
              user_id: currentUserId
            }, { onConflict: 'id' });
        }
      } catch (error) {
        console.error('Error saving on unload:', error.message);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks, currentUserId]);

  const getMode = () => {
    if (isToday(selectedDate)) return 'today';
    if (isPast(selectedDate)) return 'past';
    if (isFuture(selectedDate)) return 'future';
  };

  const mode = getMode();

  if (loading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#00ff99',
          fontSize: '20px'
        }}>
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">Daily Task Timer</h1>
      <div className="main-layout">
        <div className="calendar-section">
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} tasks={tasks} />
          <Analytics tasks={tasks} selectedDate={selectedDate} mode={mode} />
        </div>
        <div className="task-section-wrapper">
          {mode === 'future' ? (
            <div className="future-message">You cannot add tasks for future dates.</div>
          ) : (
            <TaskSection 
              tasks={tasks} 
              setTasks={setTasks} 
              mode={mode} 
              selectedDate={selectedDate}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
