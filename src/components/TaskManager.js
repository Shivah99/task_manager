import React, { useReducer, useEffect, useContext, useState, useRef } from 'react';
import { taskReducer, initialState } from '../reducers/taskReducer';
import { ThemeContext } from '../context/ThemeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';

// Use a consistent storage key with a prefix to avoid conflicts
const STORAGE_KEY = 'taskManager_tasks';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('LocalStorage is not available:', e);
    return false;
  }
};

const TaskManager = () => {
  // Use reducer for task state management
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { tasks, filter } = state;
  
  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  // Ref to track previous tasks for comparison
  const prevTasksRef = useRef([]);
  
  // Get theme context
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  // State to track if localStorage is working
  const [localStorageWorks] = useState(isLocalStorageAvailable());
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    if (!localStorageWorks) return;
    
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      console.log('Checking localStorage on init:', savedTasks);
      
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        console.log('Found tasks to load:', parsedTasks.length, parsedTasks);
        
        // Ensure we're loading valid data
        if (Array.isArray(parsedTasks)) {
          dispatch({ type: 'LOAD_TASKS', payload: parsedTasks });
          setAlert({
            show: true,
            message: `Loaded ${parsedTasks.length} tasks from storage`,
            type: 'success'
          });
        } else {
          console.warn('Stored tasks are not in expected format:', parsedTasks);
        }
      } else {
        console.log('No tasks found in localStorage');
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      setAlert({
        show: true,
        message: 'Failed to load saved tasks! Please check browser settings.',
        type: 'danger'
      });
    }
  }, [localStorageWorks]);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!localStorageWorks) return;
    
    try {
      console.log('Saving tasks to localStorage:', tasks.length, tasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      prevTasksRef.current = [...tasks];
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      setAlert({
        show: true,
        message: 'Failed to save tasks! Please check browser settings.',
        type: 'danger'
      });
    }
  }, [tasks, localStorageWorks]);
  
  // Force save tasks to localStorage
  const forceSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      console.log('Force saving tasks:', tasks.length, tasks);
      setAlert({
        show: true,
        message: 'Tasks manually saved to localStorage successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Manual save failed:', error);
      setAlert({
        show: true,
        message: 'Manual save failed! Please check browser settings.',
        type: 'danger'
      });
    }
  };

  // Check localStorage content
  const checkStorage = () => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      const otherTasks = localStorage.getItem('tasks'); // Check if tasks were saved under the old key
      
      console.log('Current localStorage content:', {
        [STORAGE_KEY]: savedTasks,
        'tasks': otherTasks
      });
      
      // Check all keys in localStorage
      console.log('All localStorage keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`- ${key}: ${localStorage.getItem(key).substring(0, 50)}...`);
      }
      
      let message;
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        message = `Found ${tasks.length} tasks in storage using key "${STORAGE_KEY}"`;
      } else if (otherTasks) {
        const tasks = JSON.parse(otherTasks);
        message = `Found ${tasks.length} tasks in storage using old key "tasks". Click Force Save to migrate.`;
      } else {
        message = 'No tasks found in any storage keys';
      }
      
      setAlert({
        show: true,
        message,
        type: 'info'
      });
    } catch (error) {
      console.error('Error checking localStorage:', error);
      setAlert({
        show: true,
        message: `Error checking storage: ${error.message}`,
        type: 'danger'
      });
    }
  };

  // Clear all tasks from both localStorage and state
  const clearAllTasks = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('tasks'); // Clear old key too
      dispatch({ type: 'LOAD_TASKS', payload: [] });
      setAlert({
        show: true,
        message: 'All tasks cleared from storage',
        type: 'warning'
      });
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  };

  // Custom dispatch to track actions
  const enhancedDispatch = (action) => {
    switch (action.type) {
      case 'ADD_TASK':
        setAlert({
          show: true,
          message: 'Task added successfully! 🎉',
          type: 'success'
        });
        break;
      case 'DELETE_TASK':
        setAlert({
          show: true,
          message: 'Task deleted successfully! 🗑️',
          type: 'danger'
        });
        break;
      case 'UPDATE_TASK':
        setAlert({
          show: true,
          message: 'Task updated successfully! ✏️',
          type: 'info'
        });
        break;
      case 'TOGGLE_COMPLETE':
        const task = tasks.find(t => t.id === action.payload);
        setAlert({
          show: true,
          message: task && !task.completed 
            ? 'Task marked as complete! ✅' 
            : 'Task marked as incomplete ⏳',
          type: 'success'
        });
        break;
      default:
        // No alert for other actions
        break;
    }
    
    // Call the original dispatch
    dispatch(action);
    
    // Force save after dispatch for critical operations
    if (['ADD_TASK', 'DELETE_TASK', 'UPDATE_TASK'].includes(action.type) && localStorageWorks) {
      setTimeout(() => {
        try {
          const updatedState = taskReducer(state, action);
          console.log('Immediate save after action:', action.type, updatedState.tasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState.tasks));
        } catch (error) {
          console.error('Error in immediate save after dispatch:', error);
        }
      }, 0);
    }
  };
  
  // Auto hide alerts after 3 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(currentAlert => ({ ...currentAlert, show: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <div className={`container-fluid mt-4 ${darkMode ? 'text-light' : ''}`}>
      {/* Alert notification */}
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`} 
             role="alert" 
             style={{ zIndex: 1050, maxWidth: '90%', width: '400px' }}>
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(prev => ({...prev, show: false}))}></button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Task Manager App 🚀</h1>
        <div>
          <button 
            className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} me-2`}
            onClick={toggleTheme}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
          
          {/* Debug buttons for localStorage */}
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-info me-1" 
              onClick={forceSave} 
              title="Force save all tasks to localStorage"
            >
              💾 Save
            </button>
            <button 
              className="btn btn-sm btn-secondary me-1" 
              onClick={checkStorage}
              title="Check what's currently in localStorage"
            >
              🔍 Check
            </button>
            <button 
              className="btn btn-sm btn-danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all tasks?')) {
                  clearAllTasks();
                }
              }}
              title="Clear all tasks from storage"
            >
              🧹 Clear
            </button>
          </div>
        </div>
      </div>
      
      <div className="row">
        {/* Left column - Task Form */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="sticky-top pt-2">
            <h3>Create Task</h3>
            <TaskForm dispatch={enhancedDispatch} darkMode={darkMode} />
          </div>
        </div>
        
        {/* Right column - Tasks List */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Tasks List 📋</h3>
            <TaskFilter filter={filter} dispatch={dispatch} darkMode={darkMode} />
          </div>
          
          <div style={{ height: '70vh', overflowY: 'auto' }} className="pe-2">
            <TaskList 
              tasks={tasks} 
              filter={filter} 
              dispatch={enhancedDispatch} 
              darkMode={darkMode} 
            />
          </div>
        </div>
      </div>
      
      {!localStorageWorks && (
        <div className="alert alert-warning mt-3">
          <strong>Warning:</strong> LocalStorage is not available in your browser. 
          Task persistence between sessions won't work. Please check your browser privacy settings.
        </div>
      )}
    </div>
  );
};

export default TaskManager;