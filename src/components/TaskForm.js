import React, { useState, useEffect } from 'react';

// Draft task storage key
const DRAFT_TASK_KEY = 'taskDraft';

const TaskForm = ({ dispatch, darkMode, showSecret }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskColor, setTaskColor] = useState('#ffffff');
  const [isSecret, setIsSecret] = useState(false);

  // State for subtasks
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');

  // Restricted color palette
  const colorOptions = [
    '#f8d7da', '#FCBB6D', '#D8737F', '#AB6C82', '#685D79', '#475C7A' // Restricted color palette
  ];

  // Load draft task when component mounts
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_TASK_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setTaskTitle(draft.title || '');
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
          title: taskTitle,
          backgroundColor: taskColor,
          isSecret,
          subtasks
        };
        localStorage.setItem(DRAFT_TASK_KEY, JSON.stringify(draft));
      } catch (e) {
        console.error('Error saving draft task:', e);
      }
    };

    if (taskTitle || subtasks.length > 0) {
      saveDraft();
    }

    const timer = setInterval(saveDraft, 5000); // Save every 5 seconds
    return () => clearInterval(timer);
  }, [taskTitle, taskColor, isSecret, subtasks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskTitle.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: Date.now().toString(),
          title: taskTitle.trim(),
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
      setTaskTitle('');
      setTaskColor('#ffffff');
      setIsSecret(false);
      setSubtasks([]);
      setNewSubtask('');

      // Clear draft
      localStorage.removeItem(DRAFT_TASK_KEY);
    }
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
      style={{ backgroundColor: darkMode ? '#616161' : '#f9f9f9', color: darkMode ? '#ffffff' : '#000000' }}
    >
      <h4 className="mb-3 fw-bold">✨ New Task</h4>
      
      <div className="mb-3">
        <input
          type="text"
          className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
          placeholder="What needs to be done?"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          autoFocus
        />
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

      {/* Task color section */}
      <div className="mb-3">
        <h6 className="fw-bold mb-2">🎨 Task Background Theme</h6>
        <div className="d-flex flex-wrap">
          {colorOptions.map(color => (
            <div 
              key={color}
              onClick={() => setTaskColor(color)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                margin: '5px',
                borderRadius: '50%',
                cursor: 'pointer',
                border: taskColor === color ? '3px solid #000' : '1px solid #ddd'
              }}
              title={`Set to ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6 d-flex align-items-center gap-2"> {/* Added d-flex and gap-2 */}
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

      <button type="submit" className={`btn ${darkMode ? 'btn-primary' : 'btn-primary'} w-100`}>
        ➕ Add Task
      </button>
    </form>
  );
};

export default TaskForm;
