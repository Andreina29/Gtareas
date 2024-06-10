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
    const horarioForm = document.getElementById('horario-form');
    const horarioList = document.getElementById('horario-list');

    const tasksPerPage = 4;
    let currentPage = 1;
    let editingTask = null;

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
    const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    const storedMaterias = JSON.parse(localStorage.getItem('materias')) || [];

    displayTasks(storedTasks, currentPage);
    displayIdeas(storedIdeas);
    displayImages(storedImages);
    displayMaterias(storedMaterias);

    document.getElementById('perfil').classList.add('active');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            document.querySelector(link.getAttribute('href')).classList.add('active');
        });
    });

    addTaskBtn.addEventListener('click', () => {
        editingTask = null;
        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        modalTitle.textContent = 'Agregar Tarea';
        modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
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

        modal.classList.add('hidden');
        taskNameInput.value = '';
        taskDescInput.value = '';
        taskDueDateInput.value = '';
        displayTasks(storedTasks, currentPage);
    });

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

        deleteBtn.addEventListener('click', () => {
            const taskIndex = Array.from(taskList.children).indexOf(tr);
            storedTasks.splice(taskIndex, 1);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
            displayTasks(storedTasks, currentPage);
        });

        taskList.appendChild(tr);
    }

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

    logoutButton.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

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

        const nuevaMateria = { name: materia, diaSemana: diaSemana, horaInicio: horaInicio, horaFin: horaFin };
        storedMaterias.push(nuevaMateria);
        localStorage.setItem('materias', JSON.stringify(storedMaterias));
        displayMaterias(storedMaterias);
    });

    function displayMaterias(materias) {
        horarioList.innerHTML = '';
        materias.forEach((materia, index) => {
            const li = document.createElement('li');
            li.textContent = `${materia.name} - ${materia.diaSemana} - ${materia.horaInicio} a ${materia.horaFin}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => {
                storedMaterias.splice(index, 1);
                localStorage.setItem('materias', JSON.stringify(storedMaterias));
                displayMaterias(storedMaterias);
            });
            li.appendChild(deleteBtn);
            horarioList.appendChild(li);
            horarioForm.reset();
        });
    }
});
.
