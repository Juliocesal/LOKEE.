document.addEventListener("DOMContentLoaded", () => {
    // Manejador de eventos para la navegación
    document.body.addEventListener("click", (e) => {
        if (e.target.tagName === "A" && e.target.getAttribute("href").startsWith("/")) {
            e.preventDefault(); // Evita la recarga
            navigateTo(e.target.getAttribute("href"));
        }
    });

    // Maneja cambios en el historial del navegador
    window.addEventListener("popstate", () => {
        loadContent(location.pathname);
    });

    // Carga inicial
    loadContent(location.pathname);
});

// Función para navegar sin recargar
function navigateTo(url) {
    history.pushState({}, "", url); // Cambia la URL sin recargar
    loadContent(url);
}

// Función para cargar contenido dinámicamente
function loadContent(route) {
    const routes = {
        "/": "/Frontend/pages/LandingPage/index.html",
        "/Explorar": "/Frontend/Html/index.html",
        "/Contacto": "/Frontend/Html/contact.html"
    };

    const contentPath = routes[route] || "/Frontend/Html/offline.html"; // Si no existe, carga 404

    fetch(contentPath)
        .then((response) => response.text())
        .then((html) => {
            document.getElementById("app").innerHTML = html;
        })
        .catch((err) => console.error("Error cargando la página:", err));
}
