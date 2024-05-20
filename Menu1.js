
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskNameInput = document.getElementById('task-name');
    const taskDescInput = document.getElementById('task-desc');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const closeModalBtn = document.querySelector('.close');
    const logoutButton = document.getElementById('logoubutton');
    let editingTask = null;

    // Recuperar tareas almacenadas en el almacenamiento local
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => addTask(task.name, task.desc));

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            sections.forEach(section => {
                section.classList.remove('active');
            });

            targetSection.classList.add('active');

            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Mostrar la sección de perfil por defecto
    document.getElementById('perfil').classList.add('active');

    // Función para agregar una nueva tarea
    addTaskBtn.addEventListener('click', () => {
        editingTask = null;
        taskNameInput.value = '';
        taskDescInput.value = '';
        modalTitle.textContent = 'Agregar Tarea';
        modal.classList.remove('hidden');
    });

    // Función para cerrar el modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Función para guardar la tarea
    saveTaskBtn.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        const taskDesc = taskDescInput.value.trim();

        if (taskName === '' || taskDesc === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (editingTask) {
            editingTask.querySelector('.task-name').textContent = taskName;
            editingTask.querySelector('.task-desc').textContent = taskDesc;
            updateStoredTasks(); // Actualizar tareas almacenadas
        } else {
            addTask(taskName, taskDesc);
            storeTask(taskName, taskDesc); // Almacenar nueva tarea
        }

        modal.classList.add('hidden');
    });

    // Función para agregar una tarea a la lista
    function addTask(name, desc) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div>
                <strong class="task-name">${name}</strong>
                <p class="task-desc">${desc}</p>
            </div>
            <div>
                <button class="edit-task-btn">Editar</button>
                <button class="delete-task-btn">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);

        const editBtn = li.querySelector('.edit-task-btn');
        const deleteBtn = li.querySelector('.delete-task-btn');

        // Editar tarea
        editBtn.addEventListener('click', () => {
            taskNameInput.value = li.querySelector('.task-name').textContent;
            taskDescInput.value = li.querySelector('.task-desc').textContent;
            modalTitle.textContent = 'Editar Tarea';
            modal.classList.remove('hidden');
            editingTask = li;
        });

        // Eliminar tarea
        deleteBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                taskList.removeChild(li);
                updateStoredTasks(); // Actualizar tareas almacenadas
            }
        });
    }

    // Función para almacenar una tarea en el almacenamiento local
    function storeTask(name, desc) {
        const task = { name, desc };
        storedTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    // Función para actualizar las tareas almacenadas en el almacenamiento local
    function updateStoredTasks() {
        const updatedTasks = Array.from(taskList.children).map(li => {
            return {
                name: li.querySelector('.task-name').textContent,
                desc: li.querySelector('.task-desc').textContent
            };
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Función para cerrar sesión
    function cerrarSesion() {
        // Aquí limpiarías cualquier dato de sesión, por ejemplo:
        localStorage.removeItem('userSession'); // O cualquier clave que estés usando para almacenar la sesión del usuario
        
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'Gtareas2.html'; // Cambia 'login.html' por la URL de tu página de inicio de sesión
    }

    // Añadir evento de cierre de sesión
    logoutButton.addEventListener('click', () => {
        cerrarSesion();
    });
})
