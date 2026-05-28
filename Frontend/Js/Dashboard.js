// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Datos de ejemplo
    const sampleData = {
      totalProperties: 50,
      activeTenants: 120,
      registeredLandlords: 30,
      totalIncome: 150000,
      totalCommissions: 15000,
      monthlyIncome: [5000, 7000, 6000, 8000, 9000, 10000], // Últimos 6 meses
      propertyStatus: [70, 30], // Ocupadas vs Disponibles
      properties: [
        { name: "Casa en la Playa", location: "Miami", status: "Ocupada", income: "$12,000" },
        { name: "Departamento Urbano", location: "Nueva York", status: "Disponible", income: "$8,500" },
        { name: "Villa de Lujo", location: "Los Ángeles", status: "Ocupada", income: "$15,000" },
      ],
      recentPayments: [
        { date: "2023-10-01", tenant: "Juan Pérez", amount: "$1,200", description: "Pago mensual", status: "Completado" },
        { date: "2023-10-05", tenant: "Ana López", amount: "$1,500", description: "Pago adelantado", status: "Pendiente" },
      ],
      commissions: [
        { date: "2023-10-01", property: "Casa en la Playa", amount: "$120", status: "Completado" },
        { date: "2023-10-05", property: "Departamento Urbano", amount: "$150", status: "Pendiente" },
      ],
      alerts: [
        "Propiedad 'Casa en la Playa' tiene pagos pendientes.",
        "Mantenimiento programado para 'Departamento Urbano'.",
      ],
    };
  
    // Actualizar KPIs
    document.getElementById("totalProperties").textContent = sampleData.totalProperties;
    document.getElementById("activeTenants").textContent = sampleData.activeTenants;
    document.getElementById("registeredLandlords").textContent = sampleData.registeredLandlords;
    document.getElementById("totalIncome").textContent = `$${sampleData.totalIncome.toFixed(2)}`;
    document.getElementById("totalCommissions").textContent = `$${sampleData.totalCommissions.toFixed(2)}`;
  
    // Gráfico de Ingresos Mensuales
    const monthlyIncomeCtx = document.getElementById("monthlyIncomeChart").getContext("2d");
    new Chart(monthlyIncomeCtx, {
      type: "bar",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Ingresos Mensuales",
            data: sampleData.monthlyIncome,
            backgroundColor: "#2575fc",
            borderColor: "#1c5bb6",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => `$${value}` },
          },
        },
      },
    });
  
    // Gráfico de Estado de Propiedades
    const propertyStatusCtx = document.getElementById("propertyStatusChart").getContext("2d");
    new Chart(propertyStatusCtx, {
      type: "pie",
      data: {
        labels: ["Ocupadas", "Disponibles"],
        datasets: [
          {
            data: sampleData.propertyStatus,
            backgroundColor: ["#28a745", "#ffc107"],
            borderColor: ["#218838", "#e0a800"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  
    // Gráfico de Tendencia de Ingresos
    const incomeTrendCtx = document.getElementById("incomeTrendChart").getContext("2d");
    new Chart(incomeTrendCtx, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Tendencia de Ingresos",
            data: sampleData.monthlyIncome,
            borderColor: "#2575fc",
            backgroundColor: "rgba(37, 117, 252, 0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => `$${value}` },
          },
        },
      },
    });
  
    // Rellenar Tabla de Propiedades
    const propertiesTableBody = document.getElementById("propertiesTable");
    sampleData.properties.forEach((property) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${property.name}</td>
        <td>${property.location}</td>
        <td>${property.status}</td>
        <td>${property.income}</td>
      `;
      propertiesTableBody.appendChild(row);
    });
  
    // Rellenar Tabla de Pagos Recientes
    const recentPaymentsTableBody = document.getElementById("recentPaymentsTable");
    sampleData.recentPayments.forEach((payment) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${payment.date}</td>
        <td>${payment.tenant}</td>
        <td>${payment.amount}</td>
        <td>${payment.description}</td>
        <td class="status-${payment.status.toLowerCase()}">${payment.status}</td>
      `;
      recentPaymentsTableBody.appendChild(row);
    });
  
    // Rellenar Tabla de Comisiones
    const commissionsTableBody = document.getElementById("commissionsTable");
    sampleData.commissions.forEach((commission) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${commission.date}</td>
        <td>${commission.property}</td>
        <td>${commission.amount}</td>
        <td class="status-${commission.status.toLowerCase()}">${commission.status}</td>
      `;
      commissionsTableBody.appendChild(row);
    });
  
    // Mostrar Alertas
    const alertsList = document.getElementById("alertsList");
    sampleData.alerts.forEach((alert) => {
      const listItem = document.createElement("li");
      listItem.textContent = alert;
      alertsList.appendChild(listItem);
    });
  
    // Filtros de Fecha
    const applyFiltersButton = document.getElementById("applyFilters");
    applyFiltersButton.addEventListener("click", function () {
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
  
      if (!startDate || !endDate) {
        alert("Por favor, selecciona un rango de fechas válido.");
        return;
      }
  
      alert(`Filtros aplicados: Desde ${startDate} hasta ${endDate}`);
      // Aquí puedes implementar la lógica para filtrar los datos según el rango de fechas
    });
  });