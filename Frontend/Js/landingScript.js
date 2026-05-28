// Smooth Scroll Behavior
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Evita el comportamiento predeterminado del enlace
            const targetId = this.getAttribute('href'); // Obtiene el ID del destino
            const targetElement = document.querySelector(targetId); // Busca el elemento de destino

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Desplazamiento suave
                    block: 'start' // Alinea el elemento al inicio de la vista
                });
            }
        });
    });
}

// Animación de Números
function animateNumber(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = Math.ceil(target / (duration / 16)); // Calcula el incremento basado en la duración
    const startTime = performance.now(); // Tiempo inicial para controlar la animación

    function updateAnimation(currentTime) {
        const elapsed = currentTime - startTime; // Tiempo transcurrido desde el inicio
        const progress = Math.min(elapsed / duration, 1); // Progreso entre 0 y 1
        const current = Math.ceil(progress * target); // Valor actual del número

        element.textContent = current + suffix; // Actualiza el texto del elemento

        if (progress < 1) {
            requestAnimationFrame(updateAnimation); // Continúa la animación
        } else {
            element.textContent = target + suffix; // Asegura que termine en el valor exacto
        }
    }

    requestAnimationFrame(updateAnimation); // Inicia la animación
}

// Observador de Intersección para Estadísticas
function setupStatsObserver() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = true; // Marca como animado para evitar repeticiones

                const target = parseInt(entry.target.dataset.number); // Valor objetivo
                const suffix = entry.target.dataset.suffix || ''; // Sufijo opcional
                const numberElement = document.createElement('span'); // Crea un span para el número
                numberElement.className = 'stat-number';
                entry.target.prepend(numberElement);

                animateNumber(numberElement, target, suffix); // Inicia la animación de números
                entry.target.classList.add('visible'); // Agrega clase visible para estilos
            }
        });
    }, { threshold: 0.5 }); // Activa cuando el 50% del elemento es visible

    document.querySelectorAll('.stat-item').forEach(item => {
        statsObserver.observe(item); // Observa cada elemento con la clase stat-item
    });
}

// Función de Easing (opcional)
function easeOutQuad(t) {
    return t * (2 - t); // Curva de easing para animaciones personalizadas
}

// Inicialización del Código
document.addEventListener('DOMContentLoaded', () => {
    setupSmoothScroll(); // Configura el desplazamiento suave
    setupStatsObserver(); // Configura el observador de estadísticas
});

// Script para mostrar/ocultar el menú en dispositivos móviles
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Agrega o quita la clase 'active'
    });
}

const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.classList.add('scroll-top');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    scrollBtn.style.display = (window.pageYOffset > 300) ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Selecciona el carrusel
const partnersTrack = document.querySelector('.partners-track');

// Pausa la animación al pasar el mouse
if (partnersTrack) {
    partnersTrack.addEventListener('mouseenter', () => {
        partnersTrack.style.animationPlayState = 'paused';
    });

// Reanuda la animación al quitar el mouse
    partnersTrack.addEventListener('mouseleave', () => {
        partnersTrack.style.animationPlayState = 'running';
    });
}


// Obtener elementos del DOM
const subscribeButton = document.getElementById('subscribeButton');
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close-btn');
const emailInput = document.getElementById('emailInput'); // Referencia al campo de correo electrónico

// Función para enviar el correo al backend
async function subscribe(email) {
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            popup.style.display = 'flex'; // Mostrar el popup
            emailInput.value = ''; // Limpiar el campo de correo electrónico
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert(`Error al registrar el correo: ${error.message}`);
    }
}

// Manejar el evento de clic en el botón "Suscribirme"
if (subscribeButton && popup && closeBtn && emailInput) {
subscribeButton.addEventListener('click', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe
    const email = emailInput.value.trim();

    if (email !== '') {
        subscribe(email); // Llamar a la función para enviar el correo
    } else {
        alert('Por favor, ingresa un correo electrónico válido.');
    }
});

// Cerrar el popup al hacer clic en la X
closeBtn.addEventListener('click', function() {
    popup.style.display = 'none'; // Ocultar el popup
});

// Cerrar el popup al hacer clic fuera de él
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
}



