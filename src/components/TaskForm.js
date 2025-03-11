import React, { useState, useCallback } from 'react';

const TaskForm = ({ dispatch, darkMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Function to add or update a task
  const handleSubmit = useCallback(() => {
    if (title && description) {
      if (editMode && currentTaskId) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            id: currentTaskId,
            updates: { title, description }
          }
        });
        setEditMode(false);
        setCurrentTaskId(null);
      } else {
        dispatch({
          type: 'ADD_TASK',
          payload: {
            id: Date.now(),
            title,
            description,
            completed: false
          }
        });
      }
      setTitle('');
      setDescription('');
    }
  }, [title, description, editMode, currentTaskId, dispatch]);

  // Cancel edit mode
  const cancelEdit = () => {
    setEditMode(false);
    setCurrentTaskId(null);
    setTitle('');
    setDescription('');
  };

  // Set form to edit mode with task data
  React.useEffect(() => {
    const handleTaskEdit = (event) => {
      if (event.detail?.task) {
        const task = event.detail.task;
        setTitle(task.title);
        setDescription(task.description);
        setEditMode(true);
        setCurrentTaskId(task.id);
      }
    };

    window.addEventListener('editTask', handleTaskEdit);
    return () => window.removeEventListener('editTask', handleTaskEdit);
  }, []);

  return (
    <div className={`card p-4 shadow ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}>
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task title"
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="description">Task Description</label>
        <textarea
          className="form-control"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task details"
          rows="5"
        ></textarea>
      </div>
      <div className="mt-3">
        <button className="btn btn-primary btn-lg w-100" onClick={handleSubmit}>
          {editMode ? 'Update Task 🔄' : 'Add Task ✨'}
        </button>
        {editMode && (
          <button className="btn btn-secondary w-100 mt-2" onClick={cancelEdit}>
            Cancel Edit ❌
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskForm;
