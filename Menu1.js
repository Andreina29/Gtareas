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
    const logoutButton = document.getElementById('logout');
    const prevButton = document.getElementById('prev-page-btn');
    const nextButton = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const ideasForm = document.getElementById('ideas-form');
    const ideasList = document.getElementById('ideas-list');
    const imageUploadForm = document.getElementById('image-upload-form');
    const horarioSection = document.getElementById('horario');
    const horarioForm = document.getElementById('horario-form');
    const horarioList = document.getElementById('horario-list');

    const tasksPerPage = 4;
    let currentPage = 1;
    let editingTask = null;

    // Recuperar tareas, ideas e imágenes almacenadas en el almacenamiento local
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
    const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];

    displayTasks(storedTasks, currentPage);
    displayIdeas(storedIdeas);
    displayImages(storedImages);

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
            <td>${name}</td>
            <td>${desc}</td>
            <td>${dueDate}</td>
            <td>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            </td>
        `;
        const editBtn = tr.querySelector('.edit-btn');
        const deleteBtn = tr.querySelector('.delete-btn');

        // Función para editar una tarea
        editBtn.addEventListener('click', () => {
            const taskIndex = Array.from(taskList.children).indexOf(tr);
            const task = storedTasks[taskIndex];
            editingTask = tr;
            taskNameInput.value = task.name;
            taskDescInput.value = task.desc;
            taskDueDateInput.value = task.dueDate;
            modalTitle.textContent = 'Editar Tarea';
            modal.classList.remove('hidden');
        });

        // Función para eliminar una tarea
        deleteBtn.addEventListener('click', () => {
            const taskIndex = Array.from(taskList.children).indexOf(tr);
            storedTasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
            displayTasks(storedTasks, currentPage);
        });

        taskList.appendChild(tr);
    }

    // Función para mostrar las tareas
    function displayTasks(tasks, page) {
        taskList.innerHTML = '';
        const startIndex = (page - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
        const paginatedTasks = tasks.slice(startIndex, endIndex);

        paginatedTasks.forEach(task => {
            addTask(task.name, task.desc, task.dueDate);
        });

        const totalPages = Math.ceil(tasks.length / tasksPerPage);
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Función para manejar la paginación
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTasks(storedTasks, currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(storedTasks.length / tasksPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTasks(storedTasks, currentPage);
        }
    });

    // Función para cerrar sesión
    logoutButton.addEventListener('click', () => {
        window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
    });

    // Función para manejar el envío de ideas
    ideasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ideaText = document.getElementById('idea-text').value.trim();
        if (!ideaText) {
            alert('Por favor, ingrese una idea.');
            return;
        }
        storedIdeas.push(ideaText);
        localStorage.setItem('ideas', JSON.stringify(storedIdeas));
        displayIdeas(storedIdeas);
        document.getElementById('idea-text').value = '';
    });

    // Función para mostrar las ideas
    function displayIdeas(ideas) {
        ideasList.innerHTML = '';
        ideas.forEach((idea, index) => {
            const li = document.createElement('li');
            li.textContent = idea;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => {
                storedIdeas.splice(index, 1);
                localStorage.setItem('ideas', JSON.stringify(storedIdeas));
                displayIdeas(storedIdeas);
            });
            li.appendChild(deleteBtn);
            ideasList.appendChild(li);
        });
    }

    // Función para manejar la carga de imágenes
    imageUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const imageUploadInput = document.getElementById('image-upload');
        const file = imageUploadInput.files[0];
        if (!file) {
            alert('Por favor, seleccione una imagen.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            storedImages.push(imageUrl);
            localStorage.setItem('uploadedImages', JSON.stringify(storedImages));
            displayImages(storedImages);
        };
        reader.readAsDataURL(file);
    });

    // Función para mostrar las imágenes
    function displayImages(images) {
        const imageList = document.getElementById('image-list');
        imageList.innerHTML = '';
        images.forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');
            const img = document.createElement('img');
            img.src = image;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => {
                storedImages.splice(index, 1);
                localStorage.setItem('uploadedImages', JSON.stringify(storedImages));
                displayImages(storedImages);
            });
            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            imageList.appendChild(imgContainer);
        });
    }
    // Función para agregar una nueva materia al horario
    function addMateria(materia, diaSemana, horaInicio, horaFin) {
        const li = document.createElement('li');
        li.textContent = `Materia: ${materia}, Día: ${diaSemana}, Hora de inicio: ${horaInicio}, Hora de fin: ${horaFin}`;
        horarioList.appendChild(li);
    }

    // Manejar la presentación del formulario de horario y agregar materia
    horarioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const materia = document.getElementById('materia').value.trim();
        const diaSemana = document.getElementById('dia-semana').value;
        const horaInicio = document.getElementById('hora-inicio').value;
        const horaFin = document.getElementById('hora-fin').value;

        if (!materia || !diaSemana || !horaInicio || !horaFin) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        addMateria(materia, diaSemana, horaInicio, horaFin);

        // Limpiar el formulario después de agregar la materia
        horarioForm.reset();
    });
    
});
