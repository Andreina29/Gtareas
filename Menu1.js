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
    
    const tasksPerPage = 4;
    let currentPage = 1;
    let editingTask = null;

    // Recuperar tareas almacenadas en el almacenamiento local
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(storedTasks, currentPage);

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
            // Editar tarea existente
            const taskIndex = Array.from(taskList.children).indexOf(editingTask);
            storedTasks[taskIndex].name = taskName;
            storedTasks[taskIndex].desc = taskDesc;
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        } else {
            // Agregar nueva tarea
            const task = { name: taskName, desc: taskDesc };
            storedTasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }

        modal.classList.add('hidden');
        displayTasks(storedTasks, currentPage);
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
                const taskIndex = Array.from(taskList.children).indexOf(li);
                storedTasks.splice(taskIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
                taskList.removeChild(li);
                displayTasks(storedTasks, currentPage);
            }
        });
    }

    // Función para mostrar las tareas con paginación
    function displayTasks(tasks, page) {
        taskList.innerHTML = '';
        const start = (page - 1) * tasksPerPage;
        const end = start + tasksPerPage;
        const paginatedTasks = tasks.slice(start, end);

        paginatedTasks.forEach(task => addTask(task.name, task.desc));

        displayPagination(tasks.length, page);
    }

    // Función para mostrar los controles de paginación
    function displayPagination(totalTasks, currentPage) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalTasks / tasksPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.classList.add('page-btn');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTasks(storedTasks, currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-btn');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayTasks(storedTasks, currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.classList.add('page-btn');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTasks(storedTasks, currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Función para cerrar sesión
    function cerrarSesion() {
        localStorage.removeItem('userSession'); // Limpiar datos de sesión
        window.location.href = 'Gtareas2.html'; // Redirigir a la página de inicio de sesión
    }

    // Añadir evento de cierre de sesión
    logoutButton.addEventListener('click', () => {
        cerrarSesion();
    });
});
