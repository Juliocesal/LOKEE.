// Escenas del tour (agrega tus propias imágenes 360°)
const tourConfig = {
    "scenes": {
        "calle": {
            "title": "Calle",
            "autoRotate": -2,
            "hfov": 110,
            "pitch": -3,
            "yaw": -360,
            "type": "equirectangular",
            "panorama": "/Frontend/Images/ImageVR/House1/House1calle.jpg",
            "hotSpots": [
                {
                    "pitch": 3,
                    "yaw": -358,
                    "type": "scene",
                    "text": "Ir a sala",
                    "sceneId": "sala"
                },
                
            ]
        },
        "sala": {
            "title": "Cocina",
            "hfov": 110,
            "autoRotate": -2,
            "pitch": -3,
            "yaw": 0,
            "type": "equirectangular",
            "panorama": "/Frontend/Images/ImageVR/House1/sala.jpg",
            "hotSpots": [
                {
                    "pitch": -2,
                    "yaw": -320,
                    "type": "scene",
                    "text": "Ir a comedor",
                    "sceneId": "comedor"
                },
                {
                    "pitch": -2,
                    "yaw": -150,
                    "type": "scene",
                    "text": "Ir a calle",
                    "sceneId": "calle"
                }
            ]
        },

        "comedor": {
            "title": "comedor",
            "hfov": 110,
            "autoRotate": -2,
            "pitch": -3,
            "yaw": 0,
            "type": "equirectangular",
            "panorama": "/Frontend/Images/ImageVR/House1/comedor.jpg",
            "hotSpots": [
                {
                    "pitch": -3,
                    "yaw": -200,
                    "type": "scene",
                    "text": "Ir a Sala",
                    "sceneId": "sala"
                }
            ]
        }
    }
};

// Mantén tu función existente con esta mejora
function cambiarEscena(sceneId) {
    viewer.loadScene(sceneId);
    
    // Actualiza el estado activo
    document.querySelectorAll('.nav-buttons button').forEach(btn => {
        const targetScene = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', targetScene === sceneId);
    });
}

// Estado inicial
document.querySelector('.nav-buttons button:first-child').classList.add('active');

// Inicializar el visor
const viewer = pannellum.viewer('panorama', {
    "default": {
        "firstScene": "calle",
        "sceneFadeDuration": 1000
    },
    "scenes": tourConfig.scenes
});

