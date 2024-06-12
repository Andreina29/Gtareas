document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registration-form').querySelector('form');
    const registrationLink = document.getElementById('show-registration-form');
    const registrationFormContainer = document.getElementById('registration-form');
    const errorMessage = document.getElementById('registration-error-message');
 
    // Dummy user data
    let currentUser = null;

    // Load user data from localStorage if any
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Login form submission
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form inputs
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Check if user exists and password matches
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            alert('¡Inicio de sesión exitoso!');
            loginForm.reset();
            // Open a new tab with the task management page
            window.open('Menu1.html', '_blank');
        } else {
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    });

    // Registration form submission
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Reset error message
        errorMessage.textContent = '';

        // Get form inputs
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value.trim();

        // Validate inputs
        if (!username || !email || !password) {
            errorMessage.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Por favor, introduce una dirección de correo electrónico válida.';
            return;
        }

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            errorMessage.textContent = 'El correo electrónico ya está registrado.';
            return;
        }

        // Registration successful
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('¡Registro exitoso!');
        registrationForm.reset();
        registrationFormContainer.classList.add('hidden');
        loginForm.parentElement.classList.remove('hidden');
    });

    // Toggle registration form visibility
    registrationLink.addEventListener('click', function (event) {
        event.preventDefault();
        registrationFormContainer.classList.toggle('hidden');
        loginForm.parentElement.classList.toggle('hidden');
    });

    function isValidEmail(email) {
        // Regexp para validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
   const logoutButton = document.getElementById('logoutButton');
   if (logoutButton){
    logoutButton.addEventListener('click', function(){
        localStorage.removeItem('currentUser');
        alert('¡Cierre de sesion exitoso!');
        window.location.href= 'Menu1.html';
    })
   }
});

...
