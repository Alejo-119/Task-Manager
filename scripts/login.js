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
            
            // Si la tarea está marcada como completada, agregar la clase 'completed'
            if (task.completed) {
                li.classList.add('completed');
            }
            
            li.textContent = task.text;
            
            // Botón para marcar como completada o incompleta
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
            completeButton.style.background = task.completed ? '#dc3545' : '#28a745'; // 
            completeButton.addEventListener('click', () => {
                
                task.completed = !task.completed; // Alternar el estado de completado
                saveUsers();
                renderTasks(); // Vuelve a renderizar la lista con el estado actualizado
            });
            
            // Botón para eliminar la tarea
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn'); // Asignar la clase 'delete-btn'
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1); // Eliminar la tarea
                saveUsers();
                renderTasks(); // Vuelve a renderizar la lista sin la tarea eliminada
            });
            
            li.appendChild(completeButton);
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
        const confirmPassword = document.getElementById('confirm-password').value.trim();
    
        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
                if (!users[username]) {
                    users[username] = { password, tasks: [] };
                    saveUsers();
                    alert('Registration successful! Please log in.');
                    registerForm.reset();
                } else {
                    alert('Username already exists. Please choose another.');
                }
            } else {
                alert('The passwords do not match. Please try again.');
            }
        } else {
            alert('Please fill in all fields.');
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
            users[currentUser].tasks.push({ text: newTask, completed: false });
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
