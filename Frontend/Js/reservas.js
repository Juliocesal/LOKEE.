// Simular la carga de datos desde un archivo JSON
const reservationsData = [
    {
      id: 1,
      type: "departamento",
      property_name: "Departamento Espacioso",
      address: "Avenida Revolución #456, Zona Río, Tijuana",
      status: "active",
      contract_period: { start_date: "2025-01-01", end_date: "2025-12-31" },
      monthly_payment: 6000,
      payment_status: [
        { month: "January", status: "paid" },
        { month: "February", status: "pending" },
      ],
      progress: 8.33,
      imageUrl: "/Frontend/Images/door-3802999_1280.jpg",
    },
    {
      id: 2,
      type: "casa",
      property_name: "Casa Moderna",
      address: "Calle Principal #123, Colonia Centro, Tijuana",
      status: "completed",
      contract_period: { start_date: "2023-01-01", end_date: "2024-12-31" },
      monthly_payment: 8000,
      payment_status: [],
      progress: 100,
      imageUrl: "/Frontend/Images/george-eastman-house-70173_1280.jpg",
    },
    {
      id: 3,
      type: "local",
      property_name: "Local Comercial",
      address: "Plaza Comercial #789, Centro, Tijuana",
      status: "pending",
      contract_period: { start_date: "", end_date: "" },
      monthly_payment: 7000,
      payment_status: [],
      progress: 0,
      imageUrl: "/Frontend/Images/window-3042834_1280.jpg",
    },
  ];
  
  // Renderizar tarjetas
  function renderReservations(data) {
  const reservationList = document.querySelector(".reservation-list");
  reservationList.innerHTML = ""; // Limpiar el contenedor

  data.forEach((reservation) => {
    const card = document.createElement("div");
    card.classList.add("reservation-card", `status-${reservation.status}`);

    card.innerHTML = `
      <div class="card-layout">
        <img src="${reservation.imageUrl}" alt="${reservation.property_name}" class="property-image">
        <div class="card-content">
          <div class="property-name">${reservation.property_name}</div>
          <div class="property-address">${reservation.address}</div>
          <div class="reservation-info">
            Contrato: Del ${formatDate(reservation.contract_period.start_date)} al ${formatDate(
              reservation.contract_period.end_date
            )} | Monto mensual: $${reservation.monthly_payment}
          </div>
          <div class="status">${capitalizeFirstLetter(reservation.status)}</div>
          ${
            reservation.status === "active" || reservation.status === "overdue"
              ? `
            <div class="payment-status">
              ${reservation.payment_status
                .map(
                  (payment) =>
                    `<span>Pago de ${payment.month}: <strong>${capitalizeFirstLetter(payment.status)}</strong></span>`
                )
                .join("")}
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${reservation.progress}%"></div>
            </div>
          `
              : ""
          }

          ${
            reservation.status === "pending"
              ? '<div class="warning">⚠️ Esperando confirmación de la cita.</div>'
              : ""
          }
        </div>
      </div>
      <div class="actions">
        ${
          reservation.status === "pending"
            ? `<button class="action-button btn-cancel"><i class="icon">❌</i> Cancelar solicitud</button>
               <button class="action-button btn-chat"><i class="icon">💬</i> Contactar propietario</button>`
            : ""
        }
        ${
          reservation.status === "active"
            ? `<button class="action-button btn-pay"><i class="icon">💳</i> Pagar ahora</button>
               <button class="action-button btn-contract"><i class="icon">📄</i> Descargar contrato</button>
               <button class="action-button btn-cancel"><i class="icon">❌</i> Cancelar contrato</button>`
            : ""
        }
        ${
          reservation.status === "completed"
            ? `<button class="action-button btn-renew"><i class="icon">🔄</i> Renovar contrato</button>
               <button class="action-button btn-details"><i class="icon">👁️</i> Ver detalles</button>`
            : ""
        }
      </div>
    `;

    reservationList.appendChild(card);
  });
}

// Función para manejar el botón de volver
document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("back-button");
  
    // Asignar evento al botón
    backButton.addEventListener("click", () => {
      // Intentar regresar a la página anterior
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Si no hay historial, redirigir al menú principal
        window.location.href = "/Frontend/Html/index.html"; // Cambia "/" por la ruta de tu menú principal
      }
    });
  });
  
  
  // Función para formatear fechas
  function formatDate(date) {
    if (!date) return "Fecha pendiente";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options);
  }
  
  // Función para capitalizar la primera letra
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Inicializar la interfaz
  renderReservations(reservationsData);