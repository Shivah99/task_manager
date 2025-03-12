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

const TaskItem = ({ task, dispatch, darkMode, showSecret }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newSubTask, setNewSubTask] = useState('');

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

  if (task.isSecret && !showSecret) {
    return null;
  }

  return (
    <div 
      className={`card mb-3 ${darkMode ? 'bg-dark border-secondary' : ''}`}
      style={{ 
        backgroundColor: darkMode ? '#333' : task.backgroundColor || '#ffffff',
        borderLeft: `5px solid ${task.completed ? '#28a745' : task.isSecret ? '#ffc107' : '#007bff'}`,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        {isEditing ? (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
            />
            <button className="btn btn-success" onClick={handleSave}>
              💾 Save
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              ❌ Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center flex-grow-1">
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={task.completed}
                  onChange={handleComplete}
                  id={`task-${task.id}`}
                  style={{ width: '1.3em', height: '1.3em', cursor: 'pointer' }}
                />
              </div>
              <h5 
                className={`mb-0 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                style={{cursor: 'pointer'}}
                onClick={handleToggleExpand}
              >
                {taskHeading} {task.isSecret && '🔒'}
                {totalSubTasks > 0 && 
                  <small className="ms-2 text-muted">({completedSubTasks}/{totalSubTasks})</small>
                }
              </h5>
            </div>
            <div>
              <button 
                className="btn btn-sm btn-link text-decoration-none p-0 me-2" 
                onClick={handleToggleExpand}
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
            {task.subTasks?.length > 0 ? (
              <div className="mb-3">
                {task.subTasks.map(subtask => (
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
          
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              🕒 Created: {formattedDate}
            </small>
            
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Change task color"
              >
                🎨
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={handleEdit}
                disabled={task.completed}
                title="Edit task"
              >
                ✏️
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={handleDelete}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {showColorPicker && (
            <div className="mt-2 p-2 border rounded">
              <div className="d-flex flex-wrap justify-content-center">
                {colorOptions.map(color => (
                  <div 
                    key={color}
                    onClick={() => handleColorChange(color)}
                    style={{
                      width: '25px',
                      height: '25px',
                      backgroundColor: color,
                      margin: '5px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: '1px solid #ddd'
                    }}
                    title={`Set to ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;