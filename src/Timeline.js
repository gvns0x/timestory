import React, { useState, useRef, useEffect, useCallback } from 'react';
import './design-system.css';

const Timeline = ({ events, selectedCategory, customCategories = [] }) => {
  const timelineRef = useRef(null);
  const [jumpDate, setJumpDate] = useState('');

  // Filter events by category
  const filteredEvents = selectedCategory 
    ? events.filter(event => event.category === selectedCategory)
    : events;

  // Calculate time range
  const getTimeRange = () => {
    if (filteredEvents.length === 0) {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      };
    }

    const dates = filteredEvents.map(event => new Date(event.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    // Add one month buffer on each side
    const start = new Date(minDate.getFullYear(), minDate.getMonth() - 1, 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
    
    return { start, end };
  };

  const { start: timelineStart, end: timelineEnd } = getTimeRange();
  
  // Calculate months between start and end
  const getMonthsBetween = (startDate, endDate) => {
    const months = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const months = getMonthsBetween(timelineStart, timelineEnd);
  const totalMonths = months.length;
  const monthWidth = 120; // pixels per month
  const totalWidth = totalMonths * monthWidth;

  // Convert date to x position
  const dateToX = useCallback((date) => {
    const targetDate = new Date(date);
    const startTime = timelineStart.getTime();
    const endTime = timelineEnd.getTime();
    const dateTime = targetDate.getTime();
    
    if (dateTime < startTime || dateTime > endTime) return -1;
    
    const progress = (dateTime - startTime) / (endTime - startTime);
    return progress * totalWidth;
  }, [timelineStart, timelineEnd, totalWidth]);

  // Get category color
  const getCategoryColor = (category) => {
    const defaultColors = {
      work: '#3b82f6',
      personal: '#10b981',
      holiday: '#f59e0b',
      milestone: '#8b5cf6'
    };
    
    // Check custom categories first
    const customCategory = customCategories.find(cat => cat.value === category);
    if (customCategory) {
      return customCategory.color;
    }
    
    return defaultColors[category] || '#64748b';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const defaultIcons = {
      work: '💼',
      personal: '👤',
      holiday: '🎉',
      milestone: '🏆'
    };
    
    // Check custom categories first
    const customCategory = customCategories.find(cat => cat.value === category);
    if (customCategory && customCategory.icon) {
      return customCategory.icon;
    }
    
    return defaultIcons[category] || '📝';
  };

  // Handle date jump
  const handleDateJump = () => {
    if (jumpDate && timelineRef.current) {
      const targetDate = new Date(jumpDate);
      const x = dateToX(targetDate);
      
      if (x >= 0) {
        // Date is within current timeline range
        const containerWidth = timelineRef.current.clientWidth;
        const scrollLeft = x - containerWidth / 2;
        timelineRef.current.scrollTo({
          left: Math.max(0, Math.min(scrollLeft, totalWidth - containerWidth)),
          behavior: 'smooth'
        });
      } else {
        // Date is outside current range - show alert
        const startYear = timelineStart.getFullYear();
        const endYear = timelineEnd.getFullYear();
        alert(`Date ${targetDate.toLocaleDateString()} is outside the timeline range (${startYear} - ${endYear}). Please add events in this time period first.`);
      }
    }
  };

  // Scroll to most recent events on mount or when events change
  useEffect(() => {
    if (timelineRef.current && filteredEvents.length > 0) {
      const mostRecentDate = new Date(Math.max(...filteredEvents.map(e => new Date(e.date))));
      const x = dateToX(mostRecentDate);
      const containerWidth = timelineRef.current.clientWidth;
      const scrollLeft = x - containerWidth * 0.8; // Show recent events towards the right
      timelineRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'auto'
      });
    }
  }, [filteredEvents, totalWidth, dateToX]);

  return (
    <div className="timeline-container">
      {/* Date Navigation */}
      <div className="timeline-controls">
        <div className="date-jump">
          <input
            type="date"
            value={jumpDate}
            onChange={(e) => setJumpDate(e.target.value)}
            className="form-input timeline-date-input"
            placeholder="Jump to date"
          />
          <button onClick={handleDateJump} className="btn btn-secondary timeline-jump-btn">
            Jump to Date
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div 
        className="timeline-scroll-container" 
        ref={timelineRef}
      >
        <div 
          className="timeline-track" 
          style={{ width: totalWidth }}
        >
          {/* Month markers */}
          {months.map((month, index) => {
            const x = index * monthWidth;
            const isJanuary = month.getMonth() === 0;
            
            return (
              <div
                key={month.toISOString()}
                className={`month-marker ${isJanuary ? 'year-marker' : ''}`}
                style={{ left: x }}
              >
                <div className={`month-line ${isJanuary ? 'year-line' : ''}`}></div>
                <div className="month-label">
                  {month.toLocaleDateString('en-US', { 
                    month: 'short'
                  })}
                </div>
                {isJanuary && (
                  <div className="year-label">
                    {month.getFullYear()}
                  </div>
                )}
              </div>
            );
          })}

          {/* Event pins */}
          {filteredEvents.map((event) => {
            const x = dateToX(event.date);
            if (x < 0) return null;

            return (
              <div
                key={event.id}
                className="event-pin"
                style={{
                  left: x,
                  backgroundColor: getCategoryColor(event.category)
                }}
                title={`${event.description} - ${new Date(event.date).toLocaleDateString()}`}
              >
                <div className="event-pin-icon">
                  {getCategoryIcon(event.category)}
                </div>
                <div className="event-tooltip">
                  <div className="event-description">{event.description}</div>
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="event-category" style={{ color: getCategoryColor(event.category) }}>
                    {getCategoryIcon(event.category)} {event.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};

export default Timeline;