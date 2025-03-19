function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    };

    const taskiItem = document.createElement('li');
    taskiItem.innerHTML = ` <span onclick="checkTask(this)">${taskInput.value}</span> <button class="remove" onclick="removeTask(this)">X</button> `

    taskList.appendChild(taskiItem);
    taskInput.value = '';
};

function removeTask(button) {
    button.parentElement.remove();
}

function checkTask(item) {
    item.classList.toggle('Concluido');
}