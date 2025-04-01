export const initialState = {
  tasks: [],
  filter: 'active', // Changed default from 'all' to 'active'
  hideCompleted: false, // Track if completed tasks should be hidden
  showSecret: false // New state to track if secret tasks should be shown
};

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, {
          ...action.payload,
          createdAt: action.payload.createdAt || new Date().toISOString(),
          backgroundColor: action.payload.backgroundColor || '#ffffff',
          subTasks: action.payload.subTasks || [],
          isSecret: action.payload.isSecret || state.showSecret,
          isExpanded: false // Default collapsed state
        }]
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
                }] 
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
                ) 
              } 
            : task
        )
      };
      
    case 'TOGGLE_TASK_EXPAND':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, isExpanded: !task.isExpanded }
            : task
        )
      };
      
    case 'TOGGLE_SECRET_TASKS':
      return {
        ...state,
        showSecret: !state.showSecret
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
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        )
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    case 'TOGGLE_HIDE_COMPLETED':
      return {
        ...state,
        hideCompleted: !state.hideCompleted
      };
    case 'SET_TASK_COLOR':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, backgroundColor: action.payload.color } : task
        )
      };
    case 'LOAD_TASKS':
      // Ensure all loaded tasks have the necessary properties
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
      
    default:
      return state;
  }
};
