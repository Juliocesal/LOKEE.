// Escenas del tour (agrega tus propias imágenes 360°)
const tourConfig = {
    "scenes": {
        "sala": {
            "title": "Sala",
            "autoRotate": -2,
            "hfov": 110,
            "pitch": -3,
            "yaw": 117,
            "type": "equirectangular",
            "panorama": "/Frontend/Images/ImageVR/Hall.jpg",
            "hotSpots": [
                {
                    "pitch": -2,
                    "yaw": 180,
                    "type": "scene",
                    "text": "Ir a Cocina",
                    "sceneId": "cocina"
                },
                {
                    "pitch": -2,
                    "yaw": 230,
                    "type": "scene",
                    "text": "Ir a Comedor",
                    "sceneId": "comedor"
                }
            ]
        },
        "cocina": {
            "title": "Cocina",
            "hfov": 110,
            "autoRotate": -2,
            "pitch": -3,
            "yaw": 0,
            "type": "equirectangular",
            "panorama": "/Frontend/Images/ImageVR/Kitchen.jpg",
            "hotSpots": [
                {
                    "pitch": -2,
                    "yaw": -280,
                    "type": "scene",
                    "text": "Volver a comedor",
                    "sceneId": "comedor"
                },

                {
                    "pitch": -2,
                    "yaw": -200,
                    "type": "scene",
                    "text": "Volver a Sala",
                    "sceneId": "sala"
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
            "panorama": "/Frontend/Images/ImageVR/Dinning.jpg",
            "hotSpots": [
                {
                    "pitch": 5,
                    "yaw": -220,
                    "type": "scene",
                    "text": "Volver a Sala",
                    "sceneId": "sala"
                },
                {
                    "pitch": 5,
                    "yaw": -140,
                    "type": "scene",
                    "text": "Volver a cocina",
                    "sceneId": "cocina"
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
        "firstScene": "sala",
        "sceneFadeDuration": 1000
    },
    "scenes": tourConfig.scenes
});

