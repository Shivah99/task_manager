import React, { useMemo, useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, filter, showSecret, dispatch, darkMode }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter secret tasks if not showing them
    if (!showSecret) {
      filtered = filtered.filter(task => !task.isSecret);
    }

    // Apply regular filter
    switch (filter) {
      case 'active':
        return filtered.filter(task => !task.completed);
      case 'completed':
        return filtered.filter(task => task.completed);
      default: // 'all' case
        return filtered;
    }
  }, [tasks, filter, showSecret]);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      // If all are selected, deselect all
      setSelectedTasks([]);
    } else {
      // Otherwise, select all
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(taskId => {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      });
      setSelectedTasks([]);
    }
  };

  const handleCompleteSelected = () => {
    if (selectedTasks.length === 0) return;

    selectedTasks.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (!task.completed) {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: taskId });
      }
    });
    setSelectedTasks([]);
  };

  return (
    <>
      {filteredTasks.length > 0 && (
        <div 
          className={`d-flex justify-content-between mb-3 p-2 rounded ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}
          style={{ backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9', color: darkMode ? '#ffffff' : '#000000' }}
        >
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAllTasks"
              checked={selectedTasks.length > 0 && selectedTasks.length === filteredTasks.length}
              onChange={handleSelectAll}
            />
            <label className={`form-check-label ${darkMode ? 'text-light' : ''}`} htmlFor="selectAllTasks">
              Select All
            </label>
          </div>
          
          {selectedTasks.length > 0 && (
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-success'}`}
                onClick={handleCompleteSelected}
                title="Mark selected tasks as completed"
              >
                ✔️ Complete Selected
              </button>
              <button 
                className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-danger'}`}
                onClick={handleDeleteSelected}
                title="Delete selected tasks"
              >
                🗑️ Delete Selected
              </button>
            </div>
          )}
        </div>
      )}
      
      {filteredTasks.length === 0 ? (
        <div 
          className={`alert ${darkMode ? 'alert-dark text-light' : 'alert-info'} text-center p-4`}
          style={{ backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9', color: darkMode ? '#ffffff' : '#000000' }}
        >
          <i className="fas fa-info-circle fa-2x mb-3"></i>
          <p className="mb-0">No tasks found! {filter !== 'all' ? 'Try changing the filter.' : 'Add your first task above.'} 🎯</p>
        </div>
      ) : (
        <div 
          className={`task-list ${darkMode ? 'text-light' : ''}`}
          style={{ backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9', color: darkMode ? '#ffffff' : '#000000' }}
        >
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              dispatch={dispatch} 
              darkMode={darkMode}
              showSecret={showSecret}
              isSelected={selectedTasks.includes(task.id)}
              onSelect={handleTaskSelect}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskList;
