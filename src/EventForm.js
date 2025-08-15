import React, { useState, useEffect } from 'react';
import './design-system.css';

const EventForm = ({ onAddEvent, onCancel, isOpen, editingEvent, customCategories = [] }) => {
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    category: 'personal'
  });

  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const defaultCategories = [
    { value: 'work', label: 'Work', color: '#3b82f6', icon: '💼' },
    { value: 'personal', label: 'Personal', color: '#10b981', icon: '👤' },
    { value: 'holiday', label: 'Holiday', color: '#f59e0b', icon: '🎉' },
    { value: 'milestone', label: 'Milestone', color: '#8b5cf6', icon: '🏆' }
  ];

  const allCategories = [...defaultCategories, ...customCategories];

  // Populate form when editing
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        description: editingEvent.description,
        date: editingEvent.date.toISOString().split('T')[0],
        category: editingEvent.category
      });
      const selectedCategory = allCategories.find(cat => cat.value === editingEvent.category);
      setCategorySearch(selectedCategory ? selectedCategory.label : editingEvent.category);
    } else {
      setFormData({
        description: '',
        date: '',
        category: 'personal'
      });
      setCategorySearch('Personal');
    }
  }, [editingEvent, isOpen, allCategories]);

  // Filter categories based on search
  const filteredCategories = allCategories.filter(cat => 
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Check if search matches exactly an existing category
  const exactMatch = allCategories.find(cat => 
    cat.label.toLowerCase() === categorySearch.toLowerCase()
  );

  // Show "Add category" option if search doesn't match exactly and search is not empty
  const shouldShowAddOption = categorySearch.trim() && !exactMatch;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description.trim() && formData.date) {
      const event = {
        id: editingEvent ? editingEvent.id : Date.now().toString(),
        description: formData.description.trim(),
        date: new Date(formData.date),
        category: formData.category
      };
      onAddEvent(event, editingEvent ? 'edit' : 'add');
      setFormData({ description: '', date: '', category: 'personal' });
    }
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category: category.value }));
    setCategorySearch(category.label);
    setShowCategoryDropdown(false);
  };

  const handleAddNewCategory = () => {
    if (categorySearch.trim()) {
      const newCategory = {
        value: categorySearch.toLowerCase().replace(/\s+/g, '-'),
        label: categorySearch.trim(),
        color: '#64748b', // Default color for custom categories
        icon: '📝' // Default icon for custom categories
      };
      onAddEvent(newCategory, 'addCategory');
      setFormData(prev => ({ ...prev, category: newCategory.value }));
      setShowCategoryDropdown(false);
    }
  };

  const handleCategorySearchChange = (e) => {
    const value = e.target.value;
    setCategorySearch(value);
    setShowCategoryDropdown(true);
    
    // If user types exactly an existing category, auto-select it
    const match = allCategories.find(cat => 
      cat.label.toLowerCase() === value.toLowerCase()
    );
    if (match) {
      setFormData(prev => ({ ...prev, category: match.value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-form-overlay">
      <div className="event-form-modal">
        <h2 className="text-xl font-semibold">
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter event description"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="category-dropdown-container">
              <input
                type="text"
                value={categorySearch}
                onChange={handleCategorySearchChange}
                onFocus={() => setShowCategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                placeholder="Search or type new category"
                className="form-input"
              />
              
              {showCategoryDropdown && (
                <div className="category-dropdown">
                  {filteredCategories.map(cat => (
                    <div
                      key={cat.value}
                      className="category-option"
                      onClick={() => handleCategorySelect(cat)}
                    >
                      <div 
                        className="category-option-color" 
                        style={{ backgroundColor: cat.color }}
                      >
                        <span className="category-option-icon">{cat.icon}</span>
                      </div>
                      <span>{cat.label}</span>
                    </div>
                  ))}
                  
                  {shouldShowAddOption && (
                    <div
                      className="category-option category-add-option"
                      onClick={handleAddNewCategory}
                    >
                      <div className="category-option-color category-add-icon">+</div>
                      <span>Add "{categorySearch}"</span>
                    </div>
                  )}
                  
                  {filteredCategories.length === 0 && !shouldShowAddOption && (
                    <div className="category-option category-no-results">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
