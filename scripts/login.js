document.addEventListener('DOMContentLoaded', () => {
    // Selección de elementos principales de la interfaz
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const authContainer = document.getElementById('auth-container');
    const taskContainer = document.getElementById('task-container');
    const logoutButton = document.getElementById('logout-button');

    // Variables para gestionar usuarios y sesiones
    const users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = localStorage.getItem('currentUser');

    // Función para guardar usuarios en el localStorage
    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // Función para guardar el usuario actual en el localStorage
    const saveCurrentUser = (username) => {
        localStorage.setItem('currentUser', username);
    };

    // Renderizar las tareas del usuario actual
    const renderTasks = () => {
        taskList.innerHTML = ''; // Limpia la lista antes de renderizar
        const tasks = users[currentUser]?.tasks || [];

        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            // Añadir clase si la tarea está completada
            if (task.completed) {
                li.classList.add('completed');
            }

            li.textContent = task.text;

            // Botón para completar/incompletar tareas
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
            completeButton.style.background = task.completed ? '#dc3545' : '#28a745'; // Rojo para completado, verde para incompleto
            completeButton.addEventListener('click', () => {
                task.completed = !task.completed; // Alternar estado de la tarea
                saveUsers(); // Guardar cambios
                renderTasks(); // Actualizar la lista de tareas
            });

            // Botón para eliminar tareas
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn'); // Asignar clase para estilos
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1); // Eliminar tarea del array
                saveUsers(); // Guardar cambios
                renderTasks(); // Actualizar la lista de tareas
            });

            // Añadir botones al elemento de la lista
            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    };

    // Mostrar el contenedor de tareas y ocultar el de autenticación
    const showTaskManager = () => {
        authContainer.style.display = 'none';
        taskContainer.style.display = 'block';
        renderTasks(); // Mostrar las tareas
    };

    // Mostrar los formularios de autenticación y ocultar las tareas
    const showAuthForms = () => {
        authContainer.style.display = 'block';
        taskContainer.style.display = 'none';
    };

    // Determinar qué mostrar al cargar la página
    if (currentUser) {
        showTaskManager();
    } else {
        showAuthForms();
    }

    // Registrar un nuevo usuario
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
                if (!users[username]) {
                    users[username] = { password, tasks: [] }; // Crear nuevo usuario
                    saveUsers(); // Guardar usuarios en localStorage
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

    // Iniciar sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (username && password) {
            if (users[username] && users[username].password === password) {
                currentUser = username;
                saveCurrentUser(username); // Guardar usuario actual
                showTaskManager(); // Mostrar el administrador de tareas
                loginForm.reset();
            } else {
                alert('Invalid username or password.');
            }
        }
    });

    // Agregar nueva tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = taskInput.value.trim();

        if (newTask) {
            users[currentUser].tasks.push({ text: newTask, completed: false }); // Añadir tarea
            saveUsers(); // Guardar cambios
            renderTasks(); // Actualizar la lista de tareas
            taskInput.value = ''; // Limpiar input
        }
    });

    // Cerrar sesión
    logoutButton.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser'); // Eliminar usuario actual del almacenamiento
        showAuthForms(); // Mostrar formulario de autenticación
    });
});
