import React, { useState, useMemo } from 'react';
import './Calendar.css';

const getTodayStr = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getHeatmapColor = (totalTimeSeconds) => {
  if (totalTimeSeconds === 0) return '#1a1a1a';
  if (totalTimeSeconds <= 1800) return '#0e4429';
  if (totalTimeSeconds <= 3600) return '#006d32';
  if (totalTimeSeconds <= 7200) return '#26a641';
  return '#39d353';
};

function Calendar({ selectedDate, setSelectedDate, tasks }) {
  const todayStr = getTodayStr();
  const currentDate = new Date(selectedDate + 'T00:00:00');
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

  // Calculate total time per date from tasks
  const totalTimePerDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const timeInSeconds = Math.floor((task.totalTime || 0) / 1000);
      acc[task.date] = (acc[task.date] || 0) + timeInSeconds;
      return acc;
    }, {});
  }, [tasks]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateClick = (day) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleMonthChange = (newMonth) => {
    setViewMonth(parseInt(newMonth));
    const selectedDateObj = new Date(selectedDate + 'T00:00:00');
    if (selectedDateObj.getFullYear() === viewYear && selectedDateObj.getMonth() === parseInt(newMonth)) {
      return;
    }
    const newDate = `${viewYear}-${String(parseInt(newMonth) + 1).padStart(2, '0')}-01`;
    setSelectedDate(newDate);
  };

  const handleYearChange = (newYear) => {
    setViewYear(parseInt(newYear));
    const selectedDateObj = new Date(selectedDate + 'T00:00:00');
    if (selectedDateObj.getFullYear() === parseInt(newYear) && selectedDateObj.getMonth() === viewMonth) {
      return;
    }
    const newDate = `${parseInt(newYear)}-${String(viewMonth + 1).padStart(2, '0')}-01`;
    setSelectedDate(newDate);
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <select className="month-selector" value={viewMonth} onChange={(e) => handleMonthChange(e.target.value)}>
          {monthNames.map((name, index) => (
            <option key={index} value={index}>{name}</option>
          ))}
        </select>
        <select className="year-selector" value={viewYear} onChange={(e) => handleYearChange(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="calendar-day empty" />;
          
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isFuture = dateStr > todayStr;
          
          // Get heatmap color based on total time for this date
          const totalTime = totalTimePerDate[dateStr] || 0;
          const heatmapColor = isFuture ? '#1a1a1a' : getHeatmapColor(totalTime);
          
          // Today gets white background, others get heatmap color
          const bgColor = isToday ? '#ffffff' : heatmapColor;
          const textColor = isToday ? '#000000' : '#ffffff';
          
          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
              style={{ 
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: isToday ? 'bold' : 'normal'
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
