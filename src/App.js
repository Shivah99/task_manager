// Importing the React library to use JSX and create components
import React from 'react';

// Importing the CSS file for styling the App component
import './App.css';

// Importing the TaskManager component which will handle task management functionality
import TaskManager from './components/TaskManager';

// Importing the ThemeProvider from the ThemeContext to provide theme-related context to the app
import { ThemeProvider } from './context/ThemeContext';

// Defining the main App component
function App() {
  return (
    // Wrapping the application in ThemeProvider to make theme context available throughout the app
    <ThemeProvider>
      <div className="App">
        {/* Rendering the TaskManager component inside the App component */}
        <TaskManager />
      </div>
    </ThemeProvider>
  );
}

// Exporting the App component as the default export of this module
export default App;
