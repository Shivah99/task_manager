# Task Manager App

## Overview
The Task Manager App is a simple React application that allows users to manage their tasks efficiently with features such as task creation, filtering, and undo/redo functionality.

### Live Demo
The project is deployed on Netlify. You can view the live demo [Task Manager](https://shivas-taskmanager.netlify.app/).

### Technical Implementation
This app demonstrates effective use of React Hooks for building a performant task management system:
- **useState**: For local component state management
- **useReducer**: For complex state logic and actions
- **useEffect**: For side effects like auto-saving and loading data
- **useContext**: For theme management across components
- **useMemo**: For optimizing expensive calculations
- **useCallback**: For preventing unnecessary re-renders
- **useRef**: For persistent references

## Installation
1. Clone the repository:
   ```bash
   git clone

## Features
- **Task Creation**: Add new tasks with ease.
- **Task Filtering**: Filter tasks based on their status (Active, Completed, Hidden, ALL).
- **Undo/Redo**: Undo and redo actions to manage tasks efficiently.
- **Dark Mode**: Toggle between light and dark themes.
- **Subtasks**: Add multiple subtasks to any task
- **Secret Tasks**: Create private tasks only visible in secret mode
- **Batch Operations**: Select and manage multiple tasks at once
- **Priority Levels**: Set task importance (Low, Medium, High, Hidden)
- **Customization**: Change task colors and collapse/expand details

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/task-manager-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd task-manager-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure
```
task-manager-app/
│
├── public/                 # Static files
│   ├── index.html          # Main HTML file
│   └── ...
│
├── src/                    # Source files
│   ├── components/         # React components
│   │   ├── TaskManager.js  # Main component
│   │   └── ...
│   ├── context/            # Context providers
│   │   └── ThemeContext.js # Theme context
│   ├── reducers/           # Reducers for state management
│   │   └── taskReducer.js  # Task reducer
│   ├── App.js              # Root component
│   └── index.js            # Entry point
│
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

## Deployment

### Live Demo
The project is deployed on Netlify. You can view the live demo [Task Manager](https://preeminent-mousse-3c7d04.netlify.app/).

### Deploying on Netlify

1. **Push your project to GitHub:**
   - Make sure your project is pushed to a GitHub repository.

2. **Create a Netlify account:**
   - Go to [Netlify](https://www.netlify.com/) and sign up or log in.

3. **Create a new site:**
   - Click on "New site from Git" and connect your GitHub account.
   - Select the repository you just created.

4. **Configure the build settings:**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

5. **Deploy the site:**
   - Click on "Deploy site" and wait for the deployment to complete.
   - Your site will be live on a Netlify subdomain. You can customize the domain in the site settings.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
