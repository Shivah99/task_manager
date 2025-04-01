export const initialState = {
  tasks: [],
  filter: 'active', // Default filter
  showSecret: false // State to track if secret tasks should be shown
};

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, {
          ...action.payload,
          createdAt: action.payload.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(), // Set updatedAt when task is created
          backgroundColor: action.payload.backgroundColor || '#ffffff',
          subTasks: action.payload.subTasks || [],
          isSecret: action.payload.isSecret || false,
          isExpanded: false // Default collapsed state
        }]
      };

    case 'TOGGLE_SECRET_TASKS':
      return {
        ...state,
        showSecret: !state.showSecret // Toggle visibility of secret tasks
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } // Update updatedAt
            : task
        )
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload.map(task => ({
          ...task,
          createdAt: task.createdAt || new Date(parseInt(task.id)).toISOString(),
          subTasks: task.subTasks || [],
          isSecret: task.isSecret || false,
          isExpanded: task.isExpanded || false
        }))
      };

    case 'REMOVE_SECRET':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, isSecret: false, updatedAt: new Date().toISOString() } // Update updatedAt
            : task
        )
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() } // Update updatedAt
            : task
        )
      };

    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: [...(task.subTasks || []), {
                  id: Date.now().toString(),
                  title: action.payload.title,
                  completed: false
                }],
                updatedAt: new Date().toISOString() // Update updatedAt
              }
            : task
        )
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: task.subTasks?.map(subtask =>
                  subtask.id === action.payload.subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
                updatedAt: new Date().toISOString() // Update updatedAt
              }
            : task
        )
      };

    default:
      return state;
  }
};
