# Task Manager App - Features

## Core Features

### Task Creation
- **Description**: Allows users to add new tasks with titles, priority levels, and custom colors.
- **Component**: `TaskForm`
- **Usage**: Fill in the task details, select priority and color, then click the "Add Task" button.
- **Features**: Includes text editing history with undo/redo functionality.

### Task Filtering
- **Description**: Filters tasks based on their status (e.g., all, completed, pending).
- **Component**: `TaskFilter`
- **Usage**: Select the desired filter option to view tasks accordingly.
- **Additional Feature**: Toggle "Hide Completed" to quickly hide completed tasks regardless of filter.

### Task Appearance Customization
- **Description**: Allows customizing the appearance of individual tasks.
- **Component**: `TaskItem`
- **Usage**: Click on the color palette icon to select from preset background colors for each task.

### Timestamp Tracking
- **Description**: Automatically records and displays when each task was created.
- **Components**: `TaskItem` (displays timestamp)
- **Usage**: Creation time is visible on each task card.

### Undo/Redo Functionality
- **Description**: Allows users to undo and redo their actions.
- **Components**: 
  - `TaskManager` (handles global undo/redo for task operations)
  - `TaskForm` (handles undo/redo for text editing)
- **Usage**: 
  - Global: Use the undo and redo buttons or press `Ctrl+Z` for undo and `Ctrl+Y` for redo.
  - Text editing: Use the small undo/redo buttons next to the input field.

### Dark Mode
- **Description**: Toggles between light and dark themes.
- **Component**: `TaskManager` (uses `ThemeContext` for theme management)
- **Usage**: Click the theme toggle button to switch between light and dark modes.

### Task List
- **Description**: Displays the list of tasks with rich formatting.
- **Component**: `TaskList` and `TaskItem`
- **Usage**: View tasks in the list, filtered by the selected filter option.

## Advanced Features

### Secret Tasks
- **Description**: Create and manage tasks that are only visible when the secret mode is enabled.
- **Components**: `TaskManager`, `TaskForm`, `TaskList`
- **Usage**: Toggle the "Secret Tasks" switch to view or create secret tasks.

### Subtasks
- **Description**: Add and manage subtasks within each main task.
- **Components**: `TaskItem`, `TaskForm`
- **Usage**: Create subtasks directly within tasks or when creating new tasks.

### Task Selection
- **Description**: Select multiple tasks for batch operations.
- **Components**: `TaskList`, `TaskItem`
- **Usage**: Use checkboxes to select tasks, then use batch action buttons.

### Priority Levels
- **Description**: Assign different priority levels to tasks.
- **Components**: `TaskForm`
- **Usage**: Select from Low, Medium, High, or Hidden priority when creating or editing tasks.

### Draft Auto-saving
- **Description**: Automatically saves task drafts while working.
- **Components**: `TaskForm`
- **Usage**: Task drafts are automatically saved every 5 seconds.

### Collapsible Task Content
- **Description**: Expand or collapse task details as needed.
- **Components**: `TaskItem`
- **Usage**: Click on task headers or the expand/collapse button to toggle visibility.
