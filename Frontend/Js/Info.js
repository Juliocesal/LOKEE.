document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize Bootstrap components
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Favorite button handling
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const propertyId = this.dataset.propertyId || 'demo_property';
            
            // Toggle visual state
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-heart');
            icon.classList.toggle('fa-heart-circle-check');
            
            // Save to localStorage
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const index = favorites.indexOf(propertyId);
            
            if (index === -1) {
                favorites.push(propertyId);
            } else {
                favorites.splice(index, 1);
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log('Favorites updated:', favorites);
        });
    });

    // Google Maps initialization
    function initMap() {
        const mapIframe = document.querySelector('.map-iframe');
        if (mapIframe && mapIframe.src.includes('YOUR_API_KEY')) {
            mapIframe.src = mapIframe.src.replace('YOUR_API_KEY', 'YOUR_ACTUAL_API_KEY');
        }
    }

    // Review submission
    document.querySelector('.review-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const comment = document.getElementById('review-comment')?.value;
        
        if (!rating || !comment) {
            showAlert('warning', 'Please complete all fields');
            return;
        }
        
        // Simulate API call
        try {
            console.log('Submitting review:', { rating, comment });
            document.getElementById('reviews-container').insertAdjacentHTML('afterbegin', `
                <div class="d-flex gap-3 mb-3">
                    <img src="https://via.placeholder.com/40" class="rounded-circle">
                    <div>
                        <h5 class="m-0">You</h5>
                        <div class="text-warning">${'★'.repeat(rating)}</div>
                        <p class="text-muted small">${new Date().toLocaleDateString()}</p>
                        <p class="text-muted">${comment}</p>
                    </div>
                </div>
            `);
            this.reset();
            showAlert('success', 'Review submitted!');
        } catch (error) {
            showAlert('danger', 'Error submitting review');
        }
    });

    // Floor plan download tracking
    document.querySelector('.download-pdf')?.addEventListener('click', () => {
        // Track download event
        console.log('Floor plan downloaded');
        // Add analytics tracking code here
    });

    // Social sharing
    document.querySelector('.share-btn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(window.location.href);
            showAlert('info', 'Link copied to clipboard');
        }
    });


    document.getElementById('visitForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar el envío predeterminado del formulario
    
        // Obtener datos del formulario
        const name = document.querySelector('#visitForm input[type="text"]').value;
        const email = document.querySelector('#visitForm input[type="email"]').value;
        const dates = [
            {
                date: document.querySelectorAll('#visitForm input[type="date"]')[0].value,
                time: document.querySelectorAll('#visitForm select')[0].value,
            },
            {
                date: document.querySelectorAll('#visitForm input[type="date"]')[1].value,
                time: document.querySelectorAll('#visitForm select')[1].value,
            },
            {
                date: document.querySelectorAll('#visitForm input[type="date"]')[2].value,
                time: document.querySelectorAll('#visitForm select')[2].value,
            },
        ];
        const message = document.querySelector('#visitForm textarea').value;
    
        // Filtrar solo las fechas/horas válidas
        const validDates = dates.filter((item) => item.date && item.time);
    
        // Validación básica
        if (!name || !email || validDates.length === 0) {
            alert('Por favor, completa los campos obligatorios.');
            return;
        }
    
        // Mostrar notificación de éxito
        showAlert('success', '¡Visita agendada exitosamente!');
    
        // Cerrar el modal automáticamente
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        modal.hide();
    
        // Limpiar el formulario después de cerrar el modal
        setTimeout(() => {
            document.getElementById('visitForm').reset();
        }, 500); // Espera 500ms para asegurar que el modal esté cerrado
    });
    
    // Función genérica para mostrar alertas
    function showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`;
        alert.style.zIndex = '1000';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000); // La alerta desaparece después de 5 segundos
    }

    // Initialization
    function init() {
        initMap();
        // Load initial data if needed
    }

    init();
});