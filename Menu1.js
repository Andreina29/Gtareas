document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const taskList = document.querySelector('#task-list tbody');
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

    const tasksPerPage = 4;
    let currentPage = 1;
    let editingTask = null;

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

    document.getElementById('perfil').classList.add('active');

    addTaskBtn.addEventListener('click', () => {
        editingTask = null;
        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        modalTitle.textContent = 'Agregar Tarea';
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    saveTaskBtn.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        const taskDueDate = taskDueDateInput.value;

        if (!taskName || !taskDesc || !taskDueDate) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (editingTask) {
            const taskIndex = Array.from(taskList.children).indexOf(editingTask);
            storedTasks[taskIndex].name = taskName;
            storedTasks[taskIndex].desc = taskDesc;
            storedTasks[taskIndex].dueDate = taskDueDate;
        } else {
            const task = { name: taskName, desc: taskDesc, dueDate: taskDueDate };
            storedTasks.push(task);
        }

        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        modal.classList.remove('active');
        displayTasks(storedTasks, currentPage);
    });

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

        editBtn.addEventListener('click', () => {
            taskNameInput.value = tr.querySelector('.task-name').textContent;
            taskDescInput.value = tr.querySelector('.task-desc').textContent;
            taskDueDateInput.value = tr.querySelector('.task-due-date').textContent;
            modalTitle.textContent = 'Editar Tarea';
            modal.classList.add('active');
            editingTask = tr;
        });

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

    function displayTasks(tasks, page) {
        taskList.innerHTML = '';
        const start = (page - 1) * tasksPerPage;
        const end = start + tasksPerPage;
        const paginatedTasks = tasks.slice(start, end);

        paginatedTasks.forEach(task => addTask(task.name, task.desc, task.dueDate));

        displayPagination(tasks.length, page);
    }

    function displayPagination(totalTasks, currentPage) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalTasks / tasksPerPage);

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                displayTasks(storedTasks, currentPage);
            }
        };

        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTasks(storedTasks, currentPage);
            }
        };

        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    function cerrarSesion() {
        localStorage.removeItem('userSession');
        window.location.href = 'Gtareas2.html';
    }

    logoutButton.addEventListener('click', () => {
        cerrarSesion();
    });
});

