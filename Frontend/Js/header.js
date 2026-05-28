// Script para mostrar/ocultar el menú en dispositivos móviles
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Agrega o quita la clase 'active'
});