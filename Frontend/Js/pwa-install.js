let deferredPrompt;

// Verificar si la PWA ya está instalada
window.addEventListener('appinstalled', () => {
    console.log('La PWA fue instalada');
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Escucha el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] beforeinstallprompt activado');
    e.preventDefault();
    deferredPrompt = e;

    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';

        installButton.addEventListener('click', () => {
            installButton.style.display = 'none';
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario aceptó la instalación');
                } else {
                    console.log('El usuario rechazó la instalación');
                }
                deferredPrompt = null;
            });
        });
    }
});