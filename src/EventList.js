import React from 'react';
import './design-system.css';

const EventList = ({ events, selectedCategory, onEditEvent, onDeleteEvent, customCategories = [] }) => {
  // Filter events by category and sort by date (most recent first)
  const filteredEvents = selectedCategory 
    ? events.filter(event => event.category === selectedCategory)
    : events;

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.date) - new Date(a.date));

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

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h3 className="text-lg font-semibold">
          Events {selectedCategory && `(${selectedCategory})`}
        </h3>
        <span className="event-count text-sm text-secondary">
          {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="empty-state">
          <p className="text-secondary">
            {selectedCategory 
              ? `No events found in "${selectedCategory}" category.`
              : 'No events added yet. Click "Add Event" to get started.'
            }
          </p>
        </div>
      ) : (
        <div className="event-list">
          {sortedEvents.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-item-content">
                <div 
                  className="event-category-indicator"
                  style={{ backgroundColor: getCategoryColor(event.category) }}
                ></div>
                
                <div className="event-details">
                  <div className="event-item-description">
                    {event.description}
                  </div>
                  <div className="event-item-meta">
                    <span className="event-item-date">
                      {formatDate(event.date)}
                    </span>
                    <span 
                      className="event-item-category"
                      style={{ color: getCategoryColor(event.category) }}
                    >
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="event-item-actions">
                  <button
                    onClick={() => onEditEvent(event)}
                    className="btn btn-secondary event-action-btn"
                    title="Edit event"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="btn btn-secondary event-action-btn"
                    title="Delete event"
                    style={{ color: 'var(--error-color)' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;