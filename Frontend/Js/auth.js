document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('signup-password'); // Referencia al campo de contraseña
    const strengthBar = document.querySelector('.strength-bar'); // Referencia a la barra de fortaleza
    const strengthText = document.querySelector('.strength-text'); // Referencia al texto de fortaleza

    // Función para evaluar la fortaleza de la contraseña
    function checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return strength;
    }

    // Actualizar la barra de fortaleza y el texto
    function updateStrengthIndicator(strength) {
        const strengthLevels = ['baja', 'media', 'alta'];
        const colors = ['var(--error-color)', 'var(--warning-color)', 'var(--success-color)'];

        let level = Math.min(Math.floor((strength - 1) / 2), 2);

        strengthBar.style.setProperty('--strength-width', `${(strength / 5) * 100}%`);
        strengthBar.style.setProperty('--strength-color', colors[level]);
        strengthText.textContent = `Seguridad: ${strengthLevels[level]}`;
    }

    // Escuchar cambios en el campo de contraseña
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value; // Obtener el valor de la contraseña
        const strength = checkPasswordStrength(password); // Evaluar la fortaleza
        updateStrengthIndicator(strength); // Actualizar la interfaz
    });
    
    const authApp = {
        init() {
            this.cacheElements();
            this.initEventListeners();
        },

        cacheElements() {
            this.forms = {
                login: document.getElementById('loginForm'),
                signup: document.getElementById('signupForm'),
                forgot: document.getElementById('forgotForm')
            };
            this.containers = {
                login: document.getElementById('loginContainer'),
                signup: document.getElementById('signupContainer'),
                forgot: document.getElementById('forgotContainer')
            };
        },

        

        initEventListeners() {
            // Alternar visibilidad de contraseña
            document.querySelectorAll('.password-toggle').forEach(button => {
                button.addEventListener('click', this.togglePasswordVisibility);
            });

            // Navegación entre formularios
            document.querySelectorAll('.text-link').forEach(link => {
                link.addEventListener('click', this.switchForm);
            });

            // Envío de formularios
            Object.values(this.forms).forEach(form => {
                form.addEventListener('submit', (e) => this.handleFormSubmit(e));  // Use arrow function here
            });

            // Validación de contraseña en tiempo real
            const passwordInput = document.getElementById('signup-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', this.updatePasswordStrength);
            }
        },

        togglePasswordVisibility(e) {
            const button = e.currentTarget;
            const input = button.previousElementSibling;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.innerHTML = isPassword ? 
                '<span class="material-icons-round">visibility</span>' :
                '<span class="material-icons-round">visibility_off</span>';
        },

        switchForm(e) {
            e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        
            const target = e.currentTarget.getAttribute('href').replace('#', ''); // Obtener el ID del contenedor objetivo
            Object.values(authApp.containers).forEach(container => {
                container.classList.add('hidden');
            });
            authApp.containers[target].classList.remove('hidden');
        },

        

        async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formId = form.id;
        const button = form.querySelector('button[type="submit"]');
        button.classList.add('loading');

        try {
            if (formId === 'loginForm') {
                await this.handleLogin();
            } else if (formId === 'signupForm') {
                await this.handleRegistration();
            } else if (formId === 'forgotForm') {
                await this.handlePasswordRecovery();
            }
        } catch (error) {
            this.showErrorNotification(error.message);
        } finally {
            button.classList.remove('loading');
        }
    },

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contraseña: password })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Error en el login');
            }
    
            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.usuario));
    
            // Redirigir al dashboard
            window.location.href = '/Frontend/Html/index.html';
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Ocurrió un error al iniciar sesión');
        }
    },

    async handleRegistration() {
        const formData = {
            nombre_completo: document.getElementById('fullname').value,
            email: document.getElementById('signup-email').value,
            contraseña: document.getElementById('signup-password').value
        };
    
        if (formData.contraseña !== document.getElementById('confirm-password').value) {
            throw new Error('Las contraseñas no coinciden');
        }
    
        const response = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
    
        const data = await response.json();
    
        if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
        }
    
        // Almacenar el token en localStorage
        localStorage.setItem('authToken', data.token);
    
        // Registro exitoso
        this.showSuccessNotification('Registro exitoso! Redirigiendo...');
        setTimeout(() => window.location.href = '/Frontend/Html/login.html', 2000);
    },

    

    async handlePasswordRecovery() {
        const email = document.getElementById('recovery-email').value;
        
        const response = await fetch('http://localhost:3000/api/recuperar-contrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en la recuperación');
        }

        this.showSuccessNotification('Se ha enviado un enlace de recuperación a tu email');
    },

    showErrorNotification(message) {
        // Implementar lógica para mostrar notificación de error
        alert(`Error: ${message}`);
    },

    showSuccessNotification(message) {
        // Implementar lógica para mostrar notificación de éxito
        alert(`Éxito: ${message}`);
    },

    };
    
    document.addEventListener('DOMContentLoaded', () => {
        // Verificar si hay un token almacenado
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
            // Si hay un token, redirigir al dashboard
            window.location.href = '/Frontend/Html/index.html';
        }
    });

    authApp.init();
});
