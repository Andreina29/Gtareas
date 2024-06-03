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
    const sections1 = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const logoutButton1 = document.getElementById('logoutButton');


    const tasksPerPage = 8;
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

    // Función para inicializar el calendario
    function initCalendar() {
        const calendar = document.getElementById('calendar');
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const calendarHeader = document.createElement('div');
        calendarHeader.className = 'calendar-header';
        calendarHeader.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;
        calendar.appendChild(calendarHeader);

        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        calendar.appendChild(calendarGrid);

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const calendarCell = document.createElement('div');
            calendarCell.className = 'calendar-cell';
            calendarCell.textContent = day;
            calendarGrid.appendChild(calendarCell);
        }
    }

    initCalendar();
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            sections1.forEach(section => sections1.classList.remove('active'));
            targetSection.classList.add('active');
        });
    });

    logoutButton1.addEventListener('click', function () {
        alert('Logging out...');
    });

    // Función para generar el calendario
    function generateCalendar(tasks) {
        const calendarGrid = document.querySelector('.calendar-grid');
        const calendarMonthYear = document.getElementById('calendar-month-year');
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        // Obtener el primer día del mes
        const firstDay = new Date(year, month, 1).getDay();
        // Obtener el último día del mes
        const lastDate = new Date(year, month + 1, 0).getDate();

        // Establecer el encabezado del calendario
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Limpiar la cuadrícula del calendario
        calendarGrid.innerHTML = '';

        // Rellenar las celdas vacías antes del primer día del mes
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell');
            calendarGrid.appendChild(emptyCell);
        }

        // Rellenar las celdas con los días del mes
        for (let day = 1; day <= lastDate; day++) {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.textContent = day;

            // Verificar si hay tareas para este día
            const taskDate = new Date(year, month, day).toISOString().split('T')[0];
            const task = tasks.find(task => task.dueDate === taskDate);

            if (task) {
                cell.style.backgroundColor = '#ffcccc'; // Cambia este color según tu preferencia
            }

            calendarGrid.appendChild(cell);
        }
    }

    // Obtener las tareas (esto debería ser reemplazado por la lógica real para obtener las tareas)
       //REVISAR LOGICA.
    const tasks = [
        { name: 'Tarea 1', dueDate: '2024-06-10' },
        { name: 'Tarea 2', dueDate: '2024-06-15' },
        { name: 'Tarea 3', dueDate: '2024-06-20' }
    ];

    // Generar el calendario con las tareas
    generateCalendar(tasks);
});
