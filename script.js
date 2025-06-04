const newTaskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button[data-filter]');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks
        .filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        })
        .forEach(task => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.completed);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const span = document.createElement('span');
            span.textContent = task.title;
            span.contentEditable = true;
            span.addEventListener('blur', () => editTask(task.id, span.textContent));

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit';
            editBtn.addEventListener('click', () => {
                span.focus();
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });
}

function addTask(title) {
    const id = Date.now().toString();
    tasks.push({ id, title, completed: false });
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id, title) {
    tasks = tasks.map(task => task.id === id ? { ...task, title } : task);
    saveTasks();
    renderTasks();
}

addBtn.addEventListener('click', () => {
    const value = newTaskInput.value.trim();
    if (value) {
        addTask(value);
        newTaskInput.value = '';
    }
});

newTaskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();
