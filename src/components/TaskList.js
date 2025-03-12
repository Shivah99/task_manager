import React, { useMemo, useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, filter, hideCompleted, showSecret, dispatch, darkMode }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Filter secret tasks if not showing them
    if (!showSecret) {
      filtered = filtered.filter(task => !task.isSecret);
    }
    
    // Apply hide completed filter if enabled
    if (hideCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }
    
    // Apply regular filter
    switch (filter) {
      case 'active':
        return filtered.filter(task => !task.completed && task.priority !== 'hidden');
      case 'completed':
        return filtered.filter(task => task.completed);
      case 'hidden':
        return filtered.filter(task => task.priority === 'hidden');
      default: // 'all' case
        return filtered;
    }
  }, [tasks, filter, hideCompleted, showSecret]);

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
        <div className="d-flex justify-content-between mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAllTasks"
              checked={selectedTasks.length > 0 && selectedTasks.length === filteredTasks.length}
              onChange={handleSelectAll}
            />
            <label className="form-check-label" htmlFor="selectAllTasks">
              Select All
            </label>
          </div>
          
          {selectedTasks.length > 0 && (
            <div className="btn-group">
              <button 
                className="btn btn-sm btn-success"
                onClick={handleCompleteSelected}
                title="Mark selected tasks as completed"
              >
                ✔️ Complete Selected
              </button>
              <button 
                className="btn btn-sm btn-danger"
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
        <div className="alert alert-info text-center p-4">
          <i className="fas fa-info-circle fa-2x mb-3"></i>
          <p className="mb-0">No tasks found! {filter !== 'all' || hideCompleted ? 'Try changing the filter.' : 'Add your first task above.'} 🎯</p>
        </div>
      ) : (
        <div className="task-list">
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
