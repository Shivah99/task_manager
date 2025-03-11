import React, { useCallback } from 'react';

const TaskItem = ({ task, dispatch, darkMode }) => {
  // Toggle task completion
  const toggleComplete = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
  }, [dispatch, task.id]);

  // Delete task
  const deleteTask = useCallback(() => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  }, [dispatch, task.id]);

  // Edit task
  const editTask = useCallback(() => {
    // Dispatch custom event to notify TaskForm
    const event = new CustomEvent('editTask', { detail: { task } });
    window.dispatchEvent(event);
  }, [task]);

  return (
    <div className={`card mb-3 ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className={`card-title ${task.completed ? 'text-decoration-line-through' : ''}`}>
            {task.title} {task.completed ? '✅' : '⏳'}
          </h5>
          <div>
            <button 
              className="btn btn-sm btn-success me-2" 
              onClick={toggleComplete}
            >
              {task.completed ? '✓ Done' : '○ Mark Complete'}
            </button>
            <button 
              className="btn btn-sm btn-warning me-2"
              onClick={editTask}
            >
              ✏️ Edit
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={deleteTask}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        <p className="card-text">{task.description}</p>
      </div>
    </div>
  );
};

export default TaskItem;
