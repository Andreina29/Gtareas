document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const taskList = document.querySelector('.task-table tbody');
    const addTaskBtn = document.getElementById('add-task-btn');
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskNameInput = document.getElementById('task-name');
    const taskDescInput = document.getElementById('task-desc');
    const taskDueDateInput = document.getElementById('task-due-date');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const closeModalBtn = document.querySelector('.close');
    const logoutButton = document.getElementById('logoutButton');
    const prevButton = document.getElementById('prev-page-btn');
    const nextButton = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const deleteImageBtn = document.getElementById('delete-image-btn');
   

    const tasksPerPage = 4;
    let currentPage = 1;
    let editingTask = null;

    // Recuperar tareas almacenadas en el almacenamiento local
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(storedTasks, currentPage);

    // Mostrar la sección de perfil por defecto
    document.getElementById('perfil').classList.add('active');

    // Manejar enlaces de navegación
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(link.getAttribute('href')).classList.add('active');  
        });
    });

    // Función para agregar una nueva tarea
    addTaskBtn.addEventListener('click', () => {
        editingTask = null;
        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
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
        const taskDueDate = taskDueDateInput.value;

        if (!taskName || !taskDesc || !taskDueDate) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (editingTask) {
            // Editar tarea existente
            const taskIndex = Array.from(taskList.children).indexOf(editingTask);
            storedTasks[taskIndex].name = taskName;
            storedTasks[taskIndex].desc = taskDesc;
            storedTasks[taskIndex].dueDate = taskDueDate;
        } else {
            // Agregar nueva tarea
            const task = { name: taskName, desc: taskDesc, dueDate: taskDueDate };
            storedTasks.push(task);
        }
        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        modal.classList.add('hidden');
        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        displayTasks(storedTasks, currentPage);
    });

    // Función para agregar una tarea a la lista
    function addTask(name, desc, dueDate) {
        const tr = document.createElement('tr');
        tr.className = 'task-item';
        tr.innerHTML = `
            <td><strong class="task-name">${name}</strong></td>
            <td><p class="task-desc">${desc}</p></td>
            <td><p class="task-due-date">${dueDate}</p></td>
            <td>
                <button class="edit-task-btn">Editar</button>
                <button class="delete-task-btn">Eliminar</button>
            </td>
        `;
        taskList.appendChild(tr);

        const editBtn = tr.querySelector('.edit-task-btn');
        const deleteBtn = tr.querySelector('.delete-task-btn');

        // Editar tarea
        editBtn.addEventListener('click', () => {
            taskNameInput.value = tr.querySelector('.task-name').textContent;
            taskDescInput.value = tr.querySelector('.task-desc').textContent;
            taskDueDateInput.value = tr.querySelector('.task-due-date').textContent;
            modalTitle.textContent = 'Editar Tarea';
            modal.classList.remove('hidden');
            editingTask = tr;
        });

        // Eliminar tarea
        deleteBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
                const taskIndex = Array.from(taskList.children).indexOf(tr);
                storedTasks.splice(taskIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
                taskList.removeChild(tr);
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

        paginatedTasks.forEach(task => addTask(task.name, task.desc, task.dueDate));
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
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                displayTasks(storedTasks, currentPage);
            }
        };
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-btn');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.onclick = () => {
                currentPage = i;
                displayTasks(storedTasks, currentPage);
            };
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.classList.add('page-btn');
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTasks(storedTasks, currentPage);
            }
        };
        paginationContainer.appendChild(nextButton);

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
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
     // Función para manejar el formulario de subir imagen
    const imageUploadForm = document.getElementById('image-upload-form');
    imageUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const imageInput = document.getElementById('image-upload');
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                console.log('Imagen cargada:', event.target.result);
                alert('Imagen subida con éxito');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecciona una imagen para subir.');
        }
    });

    // Función para eliminar la imagen subida
    deleteImageBtn.addEventListener('click', () => {
        const imageInput = document.getElementById('image-upload');
        imageInput.value = ''; // Limpiar el campo de selección de archivo
        alert('Imagen eliminada.');
    });

    // Función para manejar el formulario de ideas
    const ideasForm = document.getElementById('ideas-form');
    ideasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ideaText = document.getElementById('idea-text').value.trim();
        if (ideaText) {
            const ideasList = document.getElementById('ideas-list');
            const li = document.createElement('li');
            li.textContent = ideaText;
            ideasList.appendChild(li);
            document.getElementById('idea-text').value = '';
        } else {
            alert('Por favor, escribe una idea.');
        }
    });
   
});
