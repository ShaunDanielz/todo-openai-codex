const newTaskInput = document.getElementById('new-task');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button[data-filter]');
const clearCompletedBtn = document.getElementById('clear-completed');
const searchInput = document.getElementById('search');
const prioritySelect = document.getElementById('priority');
const themeToggle = document.getElementById('theme-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';
let theme = localStorage.getItem('theme') || 'light';

const priorityOrder = ['low', 'medium', 'high'];
const priorityIcons = { low: '🟢', medium: '🟡', high: '🔴' };

function setTheme(t) {
    document.body.classList.toggle('dark', t === 'dark');
    theme = t;
    localStorage.setItem('theme', t);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
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

            const icon = document.createElement('span');
            icon.className = 'priority';
            icon.textContent = priorityIcons[task.priority || 'low'];
            icon.addEventListener('click', () => cyclePriority(task.id));

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
            li.appendChild(icon);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });
}

function addTask(title) {
    const id = Date.now().toString();
    const priority = prioritySelect.value;
    tasks.push({ id, title, completed: false, priority });
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

function cyclePriority(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const idx = priorityOrder.indexOf(task.priority || 'low');
            const next = priorityOrder[(idx + 1) % priorityOrder.length];
            return { ...task, priority: next };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

addBtn.addEventListener('click', () => {
    const value = newTaskInput.value.trim();
    if (value) {
        addTask(value);
        newTaskInput.value = '';
        prioritySelect.value = 'low';
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

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderTasks();
});

themeToggle.addEventListener('click', () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
});

setTheme(theme);

renderTasks();
