// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales de la interfaz de usuario
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const authContainer = document.getElementById('auth-container');
    const taskContainer = document.getElementById('task-container');
    const logoutButton = document.getElementById('logout-button');

    // Usuarios almacenados en LocalStorage y el usuario actual
    const users = JSON.parse(localStorage.getItem('users')) || {}; // Carga usuarios o inicializa vacío
    let currentUser = localStorage.getItem('currentUser'); // Usuario logueado actual

    // Función para guardar usuarios en LocalStorage
    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // Función para guardar el usuario actual en LocalStorage
    const saveCurrentUser = (username) => {
        localStorage.setItem('currentUser', username);
    };

    // Renderiza la lista de tareas del usuario actual
    const renderTasks = () => {
        taskList.innerHTML = ''; // Limpia la lista
        const tasks = users[currentUser]?.tasks || []; // Obtiene tareas del usuario logueado

        tasks.forEach((task, index) => {
            // Crear el elemento de lista
            const li = document.createElement('li');

            // Añadir clase si la tarea está completada
            if (task.completed) {
                li.classList.add('completed');
            }
            li.textContent = task.text;

            // Botón para alternar estado de completado
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
            completeButton.addEventListener('click', () => {
                task.completed = !task.completed; // Cambia el estado de la tarea
                saveUsers();
                renderTasks(); // Actualiza la lista
            });

            // Botón para eliminar la tarea
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1); // Elimina la tarea del array
                saveUsers();
                renderTasks(); // Actualiza la lista
            });

            // Agrega los botones y la tarea a la lista
            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    };

    // Muestra el administrador de tareas y oculta los formularios de autenticación
    const showTaskManager = () => {
        authContainer.style.display = 'none';
        taskContainer.style.display = 'block';
        renderTasks();
    };

    // Muestra los formularios de autenticación y oculta el administrador de tareas
    const showAuthForms = () => {
        authContainer.style.display = 'block';
        taskContainer.style.display = 'none';
    };

    // Verifica si hay un usuario logueado al cargar la página
    if (currentUser) {
        showTaskManager();
    } else {
        showAuthForms();
    }

    // Registro de nuevos usuarios
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
                if (!users[username]) {
                    users[username] = { password, tasks: [] }; // Crea un nuevo usuario
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

    // Inicio de sesión de usuarios existentes
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

    // Añadir una nueva tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = taskInput.value.trim();

        if (newTask) {
            users[currentUser].tasks.push({ text: newTask, completed: false }); // Agrega una tarea
            saveUsers();
            renderTasks(); // Actualiza la lista
            taskInput.value = ''; // Limpia el campo de entrada
        }
    });

    // Cerrar sesión del usuario actual
    logoutButton.addEventListener('click', () => {
        currentUser = null; // Resetea el usuario actual
        localStorage.removeItem('currentUser');
        showAuthForms();
    });
});
