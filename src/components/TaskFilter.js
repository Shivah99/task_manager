import React, { useCallback } from 'react';

const TaskFilter = ({ filter, dispatch, darkMode }) => {
  const setFilter = useCallback((filterValue) => {
    dispatch({ type: 'SET_FILTER', payload: filterValue });
  }, [dispatch]);

  return (
    <div className="btn-group">
      <button 
        className={`btn ${filter === 'all' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`} 
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button 
        className={`btn ${filter === 'active' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button 
        className={`btn ${filter === 'completed' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default TaskFilter;
