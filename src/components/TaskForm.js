import React, { useState, useReducer, useEffect } from 'react';

// Reducer for form input history
const historyReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TEXT':
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: []
      };
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, state.past.length - 1),
        present: previous,
        future: [state.present, ...state.future]
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1)
      };
    case 'RESET':
      return {
        past: [],
        present: '',
        future: []
      };
    default:
      return state;
  }
};

// Draft task storage key
const DRAFT_TASK_KEY = 'taskDraft';

const TaskForm = ({ dispatch, darkMode, showSecret }) => {
  // State for task form history (undo/redo)
  const [inputHistory, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: '',
    future: []
  });

  const [taskColor, setTaskColor] = useState('#ffffff');
  const [isSecret, setIsSecret] = useState(false);
  
  // State for subtasks
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  
  // Load draft task when component mounts
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_TASK_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        dispatchHistory({ type: 'UPDATE_TEXT', payload: draft.title || '' });
        setTaskColor(draft.backgroundColor || '#ffffff');
        setIsSecret(draft.isSecret || false);
        setSubtasks(draft.subtasks || []);
      }
    } catch (e) {
      console.error('Error loading draft task:', e);
    }
  }, []);
  
  // Auto save draft task when form changes
  useEffect(() => {
    const saveDraft = () => {
      try {
        const draft = {
          title: inputHistory.present,
          backgroundColor: taskColor,
          isSecret,
          subtasks
        };
        localStorage.setItem(DRAFT_TASK_KEY, JSON.stringify(draft));
      } catch (e) {
        console.error('Error saving draft task:', e);
      }
    };
    
    if (inputHistory.present || subtasks.length > 0) {
      saveDraft();
    }
    
    // Set up autosave timer
    const timer = setInterval(saveDraft, 5000); // Save every 5 seconds
    return () => clearInterval(timer);
  }, [inputHistory.present, taskColor, isSecret, subtasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputHistory.present.trim()) {
      // Add the task without priority
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: Date.now().toString(),
          title: inputHistory.present.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          backgroundColor: taskColor,
          isSecret: isSecret,
          subTasks: subtasks.map(st => ({
            ...st,
            id: st.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
          }))
        }
      });
      
      // Reset form
      dispatchHistory({ type: 'RESET' });
      setTaskColor('#ffffff');
      setIsSecret(false);
      setSubtasks([]);
      setNewSubtask('');
      
      // Clear draft
      localStorage.removeItem(DRAFT_TASK_KEY);
    }
  };

  const handleInputChange = (e) => {
    dispatchHistory({ type: 'UPDATE_TEXT', payload: e.target.value });
  };

  const handleUndo = () => {
    dispatchHistory({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatchHistory({ type: 'REDO' });
  };
  
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: Date.now().toString(),
          title: newSubtask.trim(),
          completed: false
        }
      ]);
      setNewSubtask('');
    }
  };
  
  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };
  
  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };
  
  // Sort subtasks - active first, completed at the bottom
  const sortedSubtasks = [...subtasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`card ${darkMode ? 'bg-dark border-secondary text-light' : 'bg-light'} p-3`}
      style={{ backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9', color: darkMode ? '#ffffff' : '#000000' }}
    >
      <h4 className="mb-3 fw-bold">✨ New Task</h4>
      
      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            placeholder="What needs to be done?"
            value={inputHistory.present}
            onChange={handleInputChange}
            autoFocus
          />
          <button 
            type="button" 
            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`} 
            onClick={handleUndo}
            disabled={inputHistory.past.length === 0}
            title="Undo text edit"
          >
            ⏪
          </button>
          <button 
            type="button" 
            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`} 
            onClick={handleRedo}
            disabled={inputHistory.future.length === 0}
            title="Redo text edit"
          >
            ⏩
          </button>
        </div>
      </div>
      
      {/* Subtasks section */}
      <div className="mb-3">
        <h6 className="fw-bold mb-2">📋 Subtasks</h6>
        
        {sortedSubtasks.length > 0 && (
          <div className="mb-2">
            {sortedSubtasks.map(subtask => (
              <div key={subtask.id} className="d-flex align-items-center mb-1">
                <div className="form-check me-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                    style={{ width: '1.1em', height: '1.1em', cursor: 'pointer' }}
                  />
                </div>
                <span className={`flex-grow-1 ${subtask.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {subtask.title}
                </span>
                <button 
                  type="button" 
                  className="btn btn-sm btn-link text-danger p-0" 
                  onClick={() => handleRemoveSubtask(subtask.id)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="input-group input-group-sm">
          <input
            type="text"
            className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
            placeholder="Add a subtask..."
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
          />
          <button 
            type="button" 
            className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            onClick={handleAddSubtask}
          >
            ➕
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="secretTaskCheck"
              checked={isSecret}
              onChange={() => setIsSecret(!isSecret)}
            />
            <label className={`form-check-label ${darkMode ? 'text-light' : ''}`} htmlFor="secretTaskCheck">
              🔒 Create as secret task
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className={`btn ${darkMode ? 'btn-primary' : 'btn-primary'} w-100`}>
        ➕ Add Task
      </button>
    </form>
  );
};

export default TaskForm;
