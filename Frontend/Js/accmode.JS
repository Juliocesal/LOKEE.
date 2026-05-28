document.addEventListener('DOMContentLoaded', () => {
    const renterCard = document.getElementById('renterCard');
    const landlordCard = document.getElementById('landlordCard');
    const continueBtn = document.getElementById('continueBtn');
    let selectedRole = null;

    // Card selection logic
    const selectCard = (card) => {
        [renterCard, landlordCard].forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRole = card.id === 'renterCard' ? 'renter' : 'landlord';
        continueBtn.classList.remove('disabled');
    };

    

    renterCard.addEventListener('click', () => selectCard(renterCard));
    landlordCard.addEventListener('click', () => selectCard(landlordCard));

    // Continue button handler
    continueBtn.addEventListener('click', async () => {
        if (!selectedRole || continueBtn.classList.contains('disabled')) return;

        // Deshabilitar el botón y mostrar animación de carga
        continueBtn.innerHTML = 'Procesando... <i class="fas fa-spinner fa-spin"></i>';
        continueBtn.classList.add('disabled');

        try {
            // Obtener el token de autenticación
            const token = localStorage.getItem('supabase_token'); // Supongamos que guardaste el token aquí
            if (!token) throw new Error('No estás autenticado.');

            // Preparar los datos
            const data = {
                role: selectedRole === 'renter' ? 'usuario' : 'propietario'
            };

            // Hacer la solicitud al backend
            const response = await fetch('/api/users/update-role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            // Manejar la respuesta
            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Log success message

                // Redirigir según el rol seleccionado
                window.location.href = selectedRole === 'renter'
                    ? '/Frontend/pages/AccountRenter/accrent.html'
                    : '/Frontend/pages/AccountLandlord/accland.html';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el rol.');
            }
        } catch (error) {
            console.error(error.message);
            alert('Hubo un problema al actualizar el rol. Inténtalo de nuevo.');

            // Reactivar el botón en caso de error
            continueBtn.innerHTML = 'Continuar';
            continueBtn.classList.remove('disabled');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') selectCard(renterCard);
        if (e.key === 'ArrowRight') selectCard(landlordCard);
        if (e.key === 'Enter' && selectedRole) continueBtn.click();
    });
});