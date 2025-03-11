import React, { useMemo } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, filter, dispatch, darkMode }) => {
  // Memoize filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  return (
    <>
      {filteredTasks.length === 0 ? (
        <div className="alert alert-info">
          No tasks found! {filter !== 'all' ? 'Try changing the filter.' : 'Add your first task above.'} 🎯
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              dispatch={dispatch} 
              darkMode={darkMode} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskList;
