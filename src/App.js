import React, { useState } from 'react';
import EventForm from './EventForm';
import Timeline from './Timeline';
import EventList from './EventList';
import './design-system.css';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [customCategories, setCustomCategories] = useState([]);

  const defaultCategories = [
    { value: '', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'milestone', label: 'Milestone' }
  ];

  const allCategories = [
    ...defaultCategories,
    ...customCategories.map(cat => ({ value: cat.value, label: cat.label }))
  ];

  const handleAddEvent = (eventOrCategory, action = 'add') => {
    if (action === 'addCategory') {
      setCustomCategories(prev => [...prev, eventOrCategory]);
    } else if (action === 'edit') {
      setEvents(prev => prev.map(e => e.id === eventOrCategory.id ? eventOrCategory : e));
      setEditingEvent(null);
      setIsFormOpen(false);
    } else {
      setEvents(prev => [...prev, eventOrCategory]);
      setIsFormOpen(false);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1 className="text-3xl font-bold text-primary">TimeStory</h1>
          <p className="text-secondary">Your personal timeline of events</p>
        </div>
        
        <div className="app-controls">
          <div className="category-filter">
            <label htmlFor="category-select" className="form-label">
              Filter by category:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="form-select category-select"
            >
              {allCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary add-event-btn"
          >
            Add Event
          </button>
        </div>
      </header>

      <main className="app-main">
        <Timeline 
          events={events}
          selectedCategory={selectedCategory}
          customCategories={customCategories}
        />
        
        <EventList 
          events={events}
          selectedCategory={selectedCategory}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          customCategories={customCategories}
        />
      </main>

      <EventForm
        isOpen={isFormOpen}
        onAddEvent={handleAddEvent}
        onCancel={handleCancelForm}
        editingEvent={editingEvent}
        customCategories={customCategories}
      />
    </div>
  );
}

export default App;
