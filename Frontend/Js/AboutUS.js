

const counters = document.querySelectorAll('.stat-item h3');
const speed = 200;

counters.forEach(counter => {
    const target = +counter.innerText;
    let count = 0;
    
    const updateCounter = () => {
        if(count < target) {
            count++;
            counter.innerText = count;
            setTimeout(updateCounter, speed);
        } else {
            counter.innerText = target;
        }
    };
    
    // Observador para animar al entrar en viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) updateCounter();
        });
    });
    
    observer.observe(counter);
});

// 3. Carga diferida de imágenes
document.querySelectorAll('.avatar').forEach(img => {
    const src = img.src;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    img.dataset.src = src;
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('.avatar').forEach(img => observer.observe(img));

// 4. Menú responsive (si se agrega posteriormente)
document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

// 5. Tooltip para íconos sociales
document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('mouseenter', e => {
        const tooltip = document.createElement('div');
        tooltip.className = 'social-tooltip';
        tooltip.textContent = e.target.getAttribute('data-network') || 'Red social';
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        
        setTimeout(() => tooltip.remove(), 2000);
    });
});

// 6. Botón de scroll arriba
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

// 7. Formulario de contacto modal (estructura básica)
const contactButton = document.querySelector('.contact-btn');
if (contactButton) {
contactButton.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Contactanos</h2>
            <form>
                <input type="text" placeholder="Nombre">
                <input type="email" placeholder="Email">
                <textarea placeholder="Mensaje"></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.close').addEventListener('click', () => {
        modal.remove();
    });
});
}

const exploreButton = document.getElementById('exploreButton');
if (exploreButton) {
    exploreButton.addEventListener('click', function () {
        window.location.href = '/Frontend/Html/index.html';
    });
}

// Script para mostrar/ocultar el menú en dispositivos móviles
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Agrega o quita la clase 'active'
    });
}
