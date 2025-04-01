import React from 'react';

const TaskFilter = ({ filter, dispatch, darkMode }) => {
  const handleFilterChange = (newFilter) => {
    dispatch({ type: 'SET_FILTER', payload: newFilter });
  };

  return (
    <div className="btn-group ms-auto"> {/* Added ms-auto to push buttons to the right */}
      <button
        className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`}
        onClick={() => handleFilterChange('active')}
      >
        Active
      </button>
      <button
        className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`}
        onClick={() => handleFilterChange('completed')}
      >
        Completed
      </button>
      <button
        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : `btn-outline-${darkMode ? 'light' : 'primary'}`}`}
        onClick={() => handleFilterChange('all')}
      >
        ALL
      </button>
    </div>
  );
};

export default TaskFilter;
