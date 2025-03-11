import React, { useReducer, useEffect, useContext, useState, useRef, useCallback } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter';
import { taskReducer, initialState } from '../reducers/taskReducer';

// Use a simple, direct storage key
const STORAGE_KEY = 'tasks';

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
  const { tasks, filter } = state;
  
  // State for alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  
  // State for undo/redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
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
      // Initialize history with loaded tasks
      setHistory([loadedTasks]);
      setHistoryIndex(0);
      
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
  }, [tasks, alert.message, history, historyIndex]); // Ensure all dependencies are included

  // Update history whenever tasks change (except when performing undo/redo)
  useEffect(() => {
    // Skip if this is the initial render or if we're in the middle of an undo/redo operation
    if (!tasks.length || alert.message?.includes('Undo') || alert.message?.includes('Redo')) return;
    
    // Create new history by taking everything up to current index and adding new state
    const newHistory = [...history.slice(0, historyIndex + 1), [...tasks]];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [tasks, alert.message, history, historyIndex]); // Ensure all dependencies are included

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = history[newIndex];
      dispatch({ type: 'LOAD_TASKS', payload: previousState });
      
      setAlert({
        show: true,
        message: 'Undo successful! ⏪',
        type: 'info'
      });
    } else {
      setAlert({
        show: true,
        message: 'Nothing to undo! 🚫',
        type: 'warning'
      });
    }
  }, [history, historyIndex]);

  // Handle redo action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = history[newIndex];
      dispatch({ type: 'LOAD_TASKS', payload: nextState });
      
      setAlert({
        show: true,
        message: 'Redo successful! ⏩',
        type: 'info'
      });
    } else {
      setAlert({
        show: true,
        message: 'Nothing to redo! 🚫',
        type: 'warning'
      });
    }
  }, [history, historyIndex]);
  
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
      
      {/* App header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Task Manager App 🚀</h1>
        <div className="d-flex">
          <button 
            className={`btn ${darkMode ? 'btn-light' : 'btn-dark'} me-2`}
            onClick={toggleTheme}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'} Mode
          </button>
          <div className="btn-group">
            <button
              className={`btn btn-outline-secondary me-1 ${historyIndex <= 0 ? 'disabled' : ''}`}
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo the last action"
            >
              ⏪ Undo
            </button>
            <button
              className={`btn btn-outline-secondary ${historyIndex >= history.length - 1 ? 'disabled' : ''}`}
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo the previously undone action"
            >
              ⏩ Redo
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="row">
        {/* Left column - Task Form */}
        <div className="col-md-6 mb-4 mb-md-0">
          <div className="sticky-top pt-2">
            <h3>Create Task</h3>
            <TaskForm dispatch={dispatch} darkMode={darkMode} />
            <div className="mt-3">
              <p className="text-muted small">
                <strong>Keyboard Shortcuts:</strong> You can use the undo and redo buttons above 
                or press <kbd>Ctrl+Z</kbd> for undo and <kbd>Ctrl+Y</kbd> for redo.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right column - Tasks List */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Tasks List 📋</h3>
            <TaskFilter filter={filter} dispatch={dispatch} darkMode={darkMode} />
          </div>
          
          <div style={{ height: '70vh', overflowY: 'auto' }} className="pe-2">
            <TaskList tasks={tasks} filter={filter} dispatch={dispatch} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add keyboard event listeners for undo/redo
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    // Ctrl+Z for Undo
    if (e.ctrlKey && e.key === 'z') {
      document.querySelector('[title="Undo the last action"]')?.click();
      e.preventDefault();
    }
    
    // Ctrl+Y for Redo
    if (e.ctrlKey && e.key === 'y') {
      document.querySelector('[title="Redo the previously undone action"]')?.click();
      e.preventDefault();
    }
  });
}

export default TaskManager;