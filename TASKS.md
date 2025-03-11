# Task Manager App - Task Descriptions

## Task Descriptions

### Task Creation
- **Description**: Allows users to add new tasks.
- **Component**: `TaskForm`
- **Usage**: Fill in the task details and click the "Add Task" button.

### Task Filtering
- **Description**: Filters tasks based on their status (e.g., all, completed, pending).
- **Component**: `TaskFilter`
- **Usage**: Select the desired filter option to view tasks accordingly.

### Undo/Redo Functionality
- **Description**: Allows users to undo and redo their actions.
- **Components**: `TaskManager` (handles undo/redo logic)
- **Usage**: Use the undo and redo buttons or press `Ctrl+Z` for undo and `Ctrl+Y` for redo.

### Dark Mode
- **Description**: Toggles between light and dark themes.
- **Component**: `TaskManager` (uses `ThemeContext` for theme management)
- **Usage**: Click the theme toggle button to switch between light and dark modes.

### Task List
- **Description**: Displays the list of tasks.
- **Component**: `TaskList`
- **Usage**: View tasks in the list, filtered by the selected filter option.

## Additional Information
For more details on how to use each feature, refer to the main [README.md](./README.md) file.