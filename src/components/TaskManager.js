import React, { useReducer, useEffect, useContext, useState, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import { taskReducer, initialState } from '../reducers/taskReducer';

// Use a simple, direct storage key
const STORAGE_KEY = 'tasks';

// Define a simple password for secret tasks
const SECRET_TASKS_PASSWORD = '1234';

// Helper functions for working with localStorage
const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving to storage:', e);
    return false;
  }
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading from storage:', e);
    return [];
  }
};

const TaskManager = () => {
  // Use reducer for task state management
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { tasks, filter, showSecret } = state;
  
  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  // Ref for input field
  const titleInputRef = useRef(null);
  
  // Get theme context
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  // Focus input field when component mounts
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    const loadedTasks = loadFromStorage();
    
    if (Array.isArray(loadedTasks) && loadedTasks.length > 0) {
      dispatch({ type: 'LOAD_TASKS', payload: loadedTasks });
      
      setAlert({
        show: true,
        message: `Loaded ${loadedTasks.length} tasks from storage`,
        type: 'success'
      });
    }
  }, []);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveToStorage(tasks);
    }
  }, [tasks, alert.message]); // Ensure all dependencies are included
  
  // Auto hide alerts after 3 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(currentAlert => ({ ...currentAlert, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Set document title
  useEffect(() => {
    document.title = "Task Manager App";
  }, []);

  const handleToggleSecretTasks = () => {
    if (!showSecret) {
      const userInput = prompt('Enter the password to view secret tasks:');
      if (userInput === SECRET_TASKS_PASSWORD) {
        dispatch({ type: 'TOGGLE_SECRET_TASKS' });
      } else {
        alert('Incorrect password. Access denied.');
      }
    } else {
      dispatch({ type: 'TOGGLE_SECRET_TASKS' }); // Allow toggling off without a password
    }
  };

  return (
    <div className={`container-fluid mt-4 ${darkMode ? 'text-light bg-dark' : ''}`}
      style={{ backgroundColor: darkMode ? '#616161' : '', color: darkMode ? '#ffffff' : '' }}
    >
      {/* Alert notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`} 
             role="alert" 
             style={{ zIndex: 1050, maxWidth: '90%', width: '400px' }}>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(prev => ({...prev, show: false}))}></button>
        </div>
      )}
      
      {/* App header */}
      <div className="app-header mb-4"
        style={{ backgroundColor: '#568EA6', padding: '1rem', borderRadius: '8px' }}
      >
        <h1 className="text-center app-title">
          <span className="app-title-icon">📋</span> Task Manager App
        </h1>
        <div className="app-controls">
          <button 
            className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} me-2`}
            onClick={toggleTheme}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="task-layout">
        {/* Left column - Task Form */}
        <div className="task-form-container">
          <div className="sticky-top pt-2">
            <TaskForm dispatch={dispatch} darkMode={darkMode} showSecret={showSecret} />
            
            {/* Show Secret Tasks Toggle */}
            <div className="form-check form-switch mt-3 d-flex align-items-center gap-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="secretTasksSwitch" 
                checked={showSecret}
                onChange={handleToggleSecretTasks}
              />
              <label className={`form-check-label ${darkMode ? 'text-light' : ''}`} htmlFor="secretTasksSwitch">
                🔒 Show Secret Tasks
              </label>
            </div>
          </div>
        </div>
        
        {/* Right column - Tasks List */}
        <div className="tasks-list-container">
          <div className="list-header">
            <h3>Tasks List 📃</h3>
            <div className="filter-container justify-content-end">
              <TaskFilter filter={filter} dispatch={dispatch} darkMode={darkMode} />
            </div>
          </div>
          
          <div className="tasks-scroll-area">
            <TaskList 
              tasks={tasks} 
              filter={filter} 
              showSecret={showSecret}
              dispatch={dispatch} 
              darkMode={darkMode} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;