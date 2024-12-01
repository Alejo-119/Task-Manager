document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const authContainer = document.getElementById('auth-container');
    const taskContainer = document.getElementById('task-container');
    const logoutButton = document.getElementById('logout-button');

    const users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const saveCurrentUser = (username) => {
        localStorage.setItem('currentUser', username);
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = users[currentUser].tasks || [];
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveUsers();
                renderTasks();
            });
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    };

    const showTaskManager = () => {
        authContainer.style.display = 'none';
        taskContainer.style.display = 'block';
        renderTasks();
    };

    const showAuthForms = () => {
        authContainer.style.display = 'block';
        taskContainer.style.display = 'none';
    };

    if (currentUser) {
        showTaskManager();
    } else {
        showAuthForms();
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        if (username && password) {
            if (!users[username]) {
                users[username] = { password, tasks: [] };
                saveUsers();
                alert('Registration successful! Please log in.');
                registerForm.reset();
            } else {
                alert('Username already exists. Please choose another.');
            }
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (username && password) {
            if (users[username] && users[username].password === password) {
                currentUser = username;
                saveCurrentUser(username);
                showTaskManager();
                loginForm.reset();
            } else {
                alert('Invalid username or password.');
            }
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = taskInput.value.trim();
        if (newTask) {
            users[currentUser].tasks.push(newTask);
            saveUsers();
            renderTasks();
            taskInput.value = '';
        }
    });

    logoutButton.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthForms();
    });
});