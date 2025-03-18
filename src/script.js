/**
 * Saves a task to localStorage
 * @param {string} taskText - The text content of the task to be saved
 * @returns {boolean} - Success status of the operation
 */
function saveTask(taskText) {
    if (!taskText || typeof taskText !== 'string' || taskText.trim() === '') {
        return false;
    }

    try {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: Date.now(),
            text: taskText.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error('Error saving task:', error);
        return false;
    }
}

/**
 * Creates an HTML element for a task
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
 * Adds a task element to the DOM
 * @param {HTMLElement} taskElement - The task element to be added
 */
function addTaskToDOM(taskElement) {
    const taskList = document.getElementById('taskList');
    if (taskList) {
        taskList.appendChild(taskElement);
    }
}

/**
 * Loads all tasks from localStorage and displays them
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
 * Handler for adding new tasks
 */
function handleAddTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (saveTask(taskText)) {
        taskInput.value = ''; // Clear input
        updateUI();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', updateUI);

// Making functions available for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        saveTask, 
        createTaskElement, 
        addTaskToDOM, 
        loadTasks, 
        handleAddTask 
    };
}

/**
 * Removes a task from localStorage and DOM
 * @param {number} taskId - The ID of the task to remove
 * @returns {boolean} - Success status of the operation
 */
function removeTask(taskId) {
    try {
        // Remove from localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        updateUI();
        return true;
    } catch (error) {
        console.error('Error removing task:', error);
        return false;
    }
}

/**
 * Updates the pending tasks counter in the DOM
 */
function updatePendingTasksCount() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const counterElement = document.getElementById('pendingTasksCount');
    
    if (counterElement) {
        counterElement.textContent = pendingTasks;
    }
}

/**
 * Toggles the completion status of a task
 * @param {number} taskId - The ID of the task to toggle
 */
function toggleTaskComplete(taskId) {
    try {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            updateUI();
        }
    } catch (error) {
        console.error('Error toggling task completion:', error);
    }
}

/**
 * Updates all DOM elements that depend on tasks data
 */
function updateUI() {
    loadTasks();
    updatePendingTasksCount();
}