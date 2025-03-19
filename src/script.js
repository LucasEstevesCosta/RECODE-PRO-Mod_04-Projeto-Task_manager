// Event Listeners
document.addEventListener('DOMContentLoaded', updateUI);

/**
 * Handles the "Add" button click event. Gets text from input field, calls saveTask() to store it, and triggers updateUI() to refresh the display. Acts as the main entry point for adding new tasks.
 */
function handleAddTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (saveTask(taskText)) {
        taskInput.value = ''; // Clear input
        updateUI();
    }
}

/**
 * Creates a new task object with a unique ID (using Date.now()), the provided text, completion status set to false, and a timestamp. It validates the input text and returns null if invalid. 
 * @param {string} taskText - The text content of the task
 * @returns {Object|null} The created task object or null if invalid
 */
function createTask(taskText) {
    if (!taskText || typeof taskText !== 'string' || taskText.trim() === '') {
        return null;
    }

    return {
        id: Date.now(),
        text: taskText.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
}

/**
 * Handles the localStorage operations by taking an array of tasks and storing it as a JSON string. Uses localStorage.setItem() and JSON.stringify() to persist the data. Returns true if successful, false if there's an error. This function is focused solely on data persistence.
 * @param {Array} tasks - Array of task objects to store
 * @returns {boolean} - Success status of the operation
 */
function storeTasks(tasks) {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error('Error storing tasks:', error);
        return false;
    }
}

/**
 * Orchestrates the task creation and storage process. It calls createTask() to create a new task object, retrieves existing tasks from localStorage using JSON.parse(), adds the new task to the array, and then calls storeTasks() to save the updated array. Acts as a coordinator between task creation and storage operations.
 * @param {string} taskText - The text content of the task
 * @returns {boolean} - Success status of the operation
 */
function saveTask(taskText) {
    const newTask = createTask(taskText);
    if (!newTask) return false;

    try {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(newTask);
        return storeTasks(tasks);
    } catch (error) {
        console.error('Error saving task:', error);
        return false;
    }
}

/**
 * Simple function that retrieves all tasks from localStorage and handles parsing. Returns an empty array if there's an error or no tasks. Doesn't call any other functions.
 * @returns {Array} Array of task objects or empty array if none found
 */
function getTasks() {
    try {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    } catch (error) {
        console.error('Error getting tasks:', error);
        return [];
    }
}

/**
 * Updates specific properties of a task while preserving others. Calls getTasks() to retrieve current tasks and storeTasks() to save changes. Uses object spread operator for immutable updates.
 * @param {number} taskId - The ID of the task to update
 * @param {Object} updates - Object containing the properties to update
 * @returns {boolean} Success status of the operation
 */
function updateTask(taskId, updates) {
    try {
        const tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            return storeTasks(tasks);
        }
        return false;
    } catch (error) {
        console.error('Error updating task:', error);
        return false;
    }
}

/**
 * Builds and returns an HTML list item element for a task. Includes checkbox for completion status, task text, and a remove button. Applies appropriate Bootstrap classes for styling. Sets up event listeners that call toggleTaskComplete() and removeTask().
 * @param {Object} task - The task object containing id, text, and completed status
 * @returns {HTMLElement} The created task element
 */
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    taskItem.dataset.taskId = task.id;
    
    const taskContent = document.createElement('div');
    taskContent.className = 'd-flex align-items-center';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-2';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
    
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    if (task.completed) {
        taskText.style.textDecoration = 'line-through';
    }
    
    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-danger btn-sm';
    removeButton.textContent = 'Remover';
    removeButton.onclick = () => removeTask(task.id);
    
    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskText);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(removeButton);
    
    return taskItem;
}

/**
 * Toggles the completion status of a task in localStorage. Calls getTasks() to find the task, updateTask() to modify it, and updateUI() to refresh the display.
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskComplete(taskId) {
    try {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (task && updateTask(taskId, { completed: !task.completed })) {
            updateUI();
        }
    } catch (error) {
        console.error('Error toggling task completion:', error);
    }
}

/**
 * Central function that refreshes all dynamic UI elements. Called after any data changes. Calls both loadTasks() and updatePendingTasksCount() to ensure everything is in sync.
 */
function updateUI() {
    loadTasks();
    updatePendingTasksCount();
}

/**
 * Retrieves all tasks from localStorage, sorts them by creation date, and displays them in the UI. Shows an "empty list" message if no tasks exist. Also triggers the counter update.  Calls createTaskElement(), addTaskToDOM(), and updatePendingTasksCount().
 */
function loadTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    taskList.innerHTML = ''; // Clear existing tasks
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'list-group-item text-center text-muted';
        emptyMessage.textContent = 'Nenhuma tarefa encontrada';
        taskList.appendChild(emptyMessage);
        return;
    }

    // Sort tasks by creation date
    tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        addTaskToDOM(taskElement);
    });
    updatePendingTasksCount(); // Add this line
}

/**
 * Counts incomplete tasks and updates the counter badge in the UI. Used to keep track of remaining tasks. Uses getTasks()to get all tasks.
 */
function updatePendingTasksCount() {
    const tasks = getTasks();
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const counterElement = document.getElementById('pendingTasksCount');
    
    if (counterElement) {
        counterElement.textContent = pendingTasks;
    }
}


/**
 * Simply adds a task element to the task list in the DOM. Acts as a wrapper for appendChild to keep DOM manipulation centralized.
 * @param {HTMLElement} taskElement - The task element to be added
 */
function addTaskToDOM(taskElement) {
    const taskList = document.getElementById('taskList');
    if (taskList) {
        taskList.appendChild(taskElement);
    }
}

/**
 * Removes a task from by filtering out the task with the given ID. Calls updateUI() to refresh the display after removal. Returns true if successful.
 * @param {number} taskId - The ID of the task to remove
 * @returns {boolean} - Success status of the operation
 */
function removeTask(taskId) {
    try {
        // Remove from localStorage
        const tasks = getTasks();
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        updateUI();
        return true;
    } catch (error) {
        console.error('Error removing task:', error);
        return false;
    }
}
