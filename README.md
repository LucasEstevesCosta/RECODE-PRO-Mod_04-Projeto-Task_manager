# Task Manager Project

## Overview
This Task Manager is a learning exercise developed to practice DOM manipulation, event handling, and local storage in JavaScript. The project was developed with the assistance of GitHub Copilot AI to learn best practices in frontend development and code organization.

## Contributions
Feel free to contribute to this project by submitting pull requests or opening issues. Any suggestions for improvements are welcome!

## Project Description
A simple task management application that allows users to create, complete, and remove tasks. Tasks persist between sessions using localStorage, and the application provides a real-time counter of pending tasks.

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.3
- localStorage API

## Project Structure
```
RECODE-PRO-Mod_04-Projeto-Task_manager/
├── src/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Core Functions

### Storage Functions
- `getTasks()`: Retrieves all tasks from localStorage
- `storeTasks(tasks)`: Persists tasks array to localStorage
- `updateTask(taskId, updates)`: Updates specific task properties

### Task Management
- `createTask(taskText)`: Creates new task object with unique ID
- `saveTask(taskText)`: Orchestrates task creation and storage
- `removeTask(taskId)`: Removes task from storage and UI
- `toggleTaskComplete(taskId)`: Toggles task completion status

### UI Functions
- `createTaskElement(task)`: Builds HTML structure for task display
- `addTaskToDOM(taskElement)`: Adds task element to the task list
- `updatePendingTasksCount()`: Updates the pending tasks counter
- `loadTasks()`: Displays all tasks in the UI
- `updateUI()`: Central function for UI updates
- `handleAddTask()`: Handles new task addition from user input

## Future Improvements

### Structural changes
- Split the functions in different files by responsibilities

### Task Editing
- Add ability to edit existing task text
- Implement inline editing functionality

### Enhanced UI
- Add smooth transitions for task operations
- Implement drag-and-drop task reordering
- Enhance visual feedback for task interactions

### Online Storage
- Migrate from localStorage to a backend database
- Implement API integration
- Add data synchronization

### User Authentication
- Add user registration and login
- Implement secure authentication
- Enable personal task lists per user