import React, { useState, useMemo } from 'react';

const SubTaskItem = ({ subtask, taskId, dispatch }) => {
  return (
    <div className="d-flex align-items-center mb-1 ps-4">
      <div className="form-check me-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={subtask.completed}
          onChange={() => dispatch({ 
            type: 'TOGGLE_SUBTASK', 
            payload: { taskId, subtaskId: subtask.id } 
          })}
          id={`subtask-${subtask.id}`}
          style={{ width: '1.1em', height: '1.1em', cursor: 'pointer' }}
        />
      </div>
      <span className={`${subtask.completed ? 'text-decoration-line-through text-muted' : ''}`}>
        {subtask.title}
      </span>
    </div>
  );
};
const TaskItem = ({ task, dispatch, darkMode, showSecret, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newSubTask, setNewSubTask] = useState('');

  const handleRemoveSecret = () => {
    dispatch({ type: 'REMOVE_SECRET', payload: task.id });
  };

  // Format the creation date for display - using useMemo to prevent recalculation on every render
  const formattedDate = useMemo(() => {
    // Use a default date (task creation) if createdAt is not available
    const timestamp = task.createdAt ? new Date(task.createdAt) : new Date(parseInt(task.id));
    return timestamp.toLocaleString();
  }, [task.createdAt, task.id]);
  
  // Task heading - extract first line of content
  const taskHeading = task.title.split('\n')[0];
  
  // Task content - extract remaining lines of content
  const taskContent = task.title.split('\n').slice(1).join('\n');
  
  // Count completed subtasks
  const completedSubTasks = task.subTasks?.filter(st => st.completed).length || 0;
  const totalSubTasks = task.subTasks?.length || 0;
  
  // Available colors for task backgrounds
  const colorOptions = [
    '#ffffff', '#f8d7da', '#d1e7dd', '#cfe2ff', '#fff3cd', 
    '#e2e3e5', '#d7f5fa', '#e8daef', '#fadbd8'
  ];

  const handleComplete = () => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: task.id,
          updates: { title: editedTitle.trim() }
        }
      });
      setIsEditing(false);
    }
  };

  const handleColorChange = (color) => {
    dispatch({
      type: 'SET_TASK_COLOR',
      payload: {
        id: task.id,
        color: color
      }
    });
    setShowColorPicker(false);
  };
  
  const handleAddSubTask = (e) => {
    e.preventDefault();
    if (newSubTask.trim()) {
      dispatch({
        type: 'ADD_SUBTASK',
        payload: {
          taskId: task.id,
          title: newSubTask.trim()
        }
      });
      setNewSubTask('');
    }
  };
  
  const handleToggleExpand = () => {
    dispatch({ type: 'TOGGLE_TASK_EXPAND', payload: task.id });
  };

  // Sort subtasks - active first, completed at the bottom - with added animation
  const sortedSubTasks = useMemo(() => {
    if (!task.subTasks || task.subTasks.length === 0) return [];
    
    return [...task.subTasks].sort((a, b) => {
      // If one is completed and the other isn't, the completed one goes to the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
  }, [task.subTasks]);
  
  // Handle clicking the entire task header to toggle expand
  const handleHeaderClick = (e) => {
    // Don't expand if clicking on checkbox or action buttons
    if (e.target.type === 'checkbox' || e.target.closest('.btn-group') || e.target.closest('button')) {
      return;
    }
    
    handleToggleExpand();
  };

  if (task.isSecret && !showSecret) {
    return null;
  }

  return (
    <div 
      className={`card mb-3 ${darkMode ? 'bg-dark border-secondary' : ''} ${isSelected ? 'border border-primary border-2' : ''}`}
      style={{ 
        backgroundColor: darkMode ? '#616161' : task.backgroundColor || '#ffffff',
        borderLeft: `5px solid ${task.completed ? '#28a745' : task.isSecret ? '#ffc107' : '#007bff'}`,
        color: darkMode ? '#ffffff' : '#000000', // Ensure text is visible
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="card-header d-flex justify-content-between align-items-center"
        onClick={handleHeaderClick}
        style={{ cursor: 'pointer' }}
      >
        {isEditing ? (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()} // Prevent header click handler
            />
            <button 
              className="btn btn-success" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent header click handler
                handleSave();
              }}
            >
              💾 Save
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent header click handler
                setIsEditing(false);
              }}
            >
              ❌ Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center flex-grow-1">
              <div className="form-check me-2" onClick={(e) => e.stopPropagation()}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect && onSelect(task.id)}
                  id={`select-task-${task.id}`}
                  style={{ 
                    width: '1.3em', 
                    height: '1.3em',
                    cursor: 'pointer'
                  }}
                  title="Select for batch operations"
                />
              </div>
              <h5 
                className={`mb-0 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
              >
                {taskHeading} {task.isSecret && '🔒'}
                {totalSubTasks > 0 && 
                  <small className="ms-2 text-muted">({completedSubTasks}/{totalSubTasks})</small>
                }
              </h5>
            </div>
            <div className="d-flex align-items-center" onClick={(e) => e.stopPropagation()}>
              <div className="btn-group me-2">
                <button 
                  className="btn btn-sm btn-outline-success" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent header click handler
                    handleComplete();
                  }}
                  title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed ? '❌' : '✔️'}
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent header click handler
                    setShowColorPicker(!showColorPicker);
                  }}
                  title="Change task color"
                >
                  🎨
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent header click handler
                    handleEdit();
                  }}
                  disabled={task.completed}
                  title="Edit task"
                >
                  ✏️
                </button>
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent header click handler
                    handleDelete();
                  }}
                  title="Delete task"
                >
                  🗑️
                </button>
                {task.isSecret && (
                  <button 
                    className="btn btn-sm btn-outline-warning"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent header click handler
                      handleRemoveSecret();
                    }}
                    title="Remove from Secret"
                  >
                    🔓
                  </button>
                )}
              </div>
              <button 
                className="btn btn-sm btn-link text-decoration-none p-0" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent header click handler
                  handleToggleExpand();
                }}
                title={task.isExpanded ? "Collapse" : "Expand"}
              >
                {task.isExpanded ? '🔼' : '🔽'}
              </button>
            </div>
          </>
        )}
      </div>
      
      {task.isExpanded && (
        <div className="card-body">
          {taskContent && (
            <p className="mb-3">{taskContent}</p>
          )}
          
          <div className="mb-3">
            <h6 className="fw-bold">Subtasks</h6>
            {sortedSubTasks.length > 0 ? (
              <div className="mb-3 subtask-container">
                {sortedSubTasks.map(subtask => (
                  <SubTaskItem 
                    key={subtask.id} 
                    subtask={subtask} 
                    taskId={task.id}
                    dispatch={dispatch} 
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted small">No subtasks yet</p>
            )}
            <form onSubmit={handleAddSubTask} className="input-group input-group-sm">
              <input
                type="text"
                className="form-control"
                placeholder="Add a subtask..."
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-secondary">
                ➕
              </button>
            </form>
          </div>
          
          <div className="d-flex justify-content-end align-items-center">
            <small className="text-muted me-auto">
              🕒 Created: {formattedDate}
            </small>
            
            {showColorPicker && (
              <div className="ms-2 border rounded p-1 d-flex flex-wrap" style={{maxWidth: '200px'}}>
                {colorOptions.map(color => (
                  <div 
                    key={color}
                    onClick={() => handleColorChange(color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: color,
                      margin: '2px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: '1px solid #ddd'
                    }}
                    title={`Set to ${color}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;