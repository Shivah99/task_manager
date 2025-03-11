# Task Manager App

## Overview
The Task Manager App is a simple React application that allows users to manage their tasks. It includes features such as task creation, task filtering, and undo/redo functionality.

### Live Demo
The project is deployed on Netlify. You can view the live demo [Task Manager](https://preeminent-mousse-3c7d04.netlify.app/).

## Features
- **Task Creation**: Add new tasks with ease.
- **Task Filtering**: Filter tasks based on their status.
- **Undo/Redo**: Undo and redo actions to manage tasks efficiently.
- **Dark Mode**: Toggle between light and dark themes.

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
│   └── ...existing code...
│
├── src/                    # Source files
│   ├── components/         # React components
│   │   ├── TaskManager.js  # Main component
│   │   └── ...existing code...
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

## Keyboard Shortcuts
- **Undo**: Press `Ctrl+Z` to undo the last action.
- **Redo**: Press `Ctrl+Y` to redo the previously undone action.

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

### Deploying on Vercel

1. **Push your project to GitHub:**
   - Make sure your project is pushed to a GitHub repository.

2. **Create a Netlify Account:**
   - Go to [Vercel](https://www.netlify.com//) and sign up or log in.

3. **Create a new project:**
   - Click on "New Project" and import your GitHub repository.

4. **Configure the build settings:**
   - Vercel automatically detects the framework and sets the build command and output directory. If needed, you can manually set:
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

5. **Deploy the project:**
   - Click on "Deploy" and wait for the deployment to complete.
   - Your site will be live on a Vercel subdomain. You can customize the domain in the project settings.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
