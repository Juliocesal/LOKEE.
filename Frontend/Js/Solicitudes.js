// Datos de ejemplo para las peticiones de visita
const requests = [
    {
        property: "Casa Moderna",
        owner: "Juan Pérez",
        status: "Pendiente",
    },
    {
        property: "Departamento Espacioso",
        owner: "María López",
        status: "Aceptada",
    },
    {
        property: "Local Comercial",
        owner: "Carlos Ramírez",
        status: "Rechazada",
    },
];

// Función para renderizar las peticiones en la lista
function renderRequests() {
    const requestsList = document.getElementById("requests-list");
    requestsList.innerHTML = ""; // Limpiar la lista

    requests.forEach((request) => {
        const listItem = document.createElement("li");
        listItem.classList.add("request-item");

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("request-details");
        detailsDiv.innerHTML = `
            <p><strong>Propiedad:</strong> ${request.property}</p>
            <p><strong>Propietario:</strong> ${request.owner}</p>
            <p><strong>Estado:</strong> ${request.status}</p>
        `;

        const chatButton = document.createElement("button");
        chatButton.classList.add("chat-button");
        chatButton.textContent = "Conversar";
        chatButton.addEventListener("click", () => openChat(request.owner));

        listItem.appendChild(detailsDiv);
        listItem.appendChild(chatButton);

        requestsList.appendChild(listItem);
    });
}

// Función para abrir un chat simulado
function openChat(owner) {
    alert(`Iniciando chat con ${owner}...`);
    // Aquí puedes integrar una API de chat o redirigir a una plataforma de mensajería
}

// Renderizar las peticiones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderRequests();
});