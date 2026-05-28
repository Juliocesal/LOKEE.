document.addEventListener("DOMContentLoaded", function () {
    const paymentForm = document.getElementById("paymentForm");
    const contractDownload = document.getElementById("contractDownload");
    const downloadContractBtn = document.getElementById("downloadContractBtn");
  
    let contractHTML = ""; // Variable para almacenar el contrato generado
  
    paymentForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Obtener los valores del formulario
      const property = document.getElementById("property").value;
      const tenantName = document.getElementById("tenantName").value;
      const tenantEmail = document.getElementById("tenantEmail").value;
      const amount = document.getElementById("amount").value;
      const date = document.getElementById("date").value;
      const description = document.getElementById("description").value;
  
      // Validar que todos los campos estén completos
      if (!property || !tenantName || !tenantEmail || !amount || !date) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }
  
      // Generar el contrato en formato HTML
      contractHTML = `
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 10px; /* Tamaño de fuente general */
      line-height: 1.4;
    }
    h1 {
      font-size: 16px; /* Título principal */
    }
    h2 {
      font-size: 12px; /* Subtítulo */
    }
    p, li {
      font-size: 10px; /* Párrafos y listas */
    }
    strong {
      font-weight: bold;
    }
  </style>
  <h1>Contrato de Alquiler</h1>
  <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
  <p><strong>Propiedad:</strong> ${property}</p>
  <p><strong>Inquilino:</strong> ${tenantName} (${tenantEmail})</p>
  <p><strong>Monto del Pago:</strong> $${parseFloat(amount).toFixed(2)}</p>
  <p><strong>Fecha del Pago:</strong> ${new Date(date).toLocaleDateString()}</p>
  <p><strong>Descripción:</strong> ${description || "Sin descripción"}</p>
  <h2>Términos y Condiciones</h2>
  <ol>
    <li>El inquilino se compromete a pagar el monto acordado en la fecha especificada.</li>
    <li>El propietario garantiza que la propiedad estará disponible en las condiciones acordadas.</li>
    <li>Cualquier incumplimiento será notificado por escrito.</li>
  </ol>
  <p>Firma del Propietario: ___________________________</p>
  <p>Firma del Inquilino: ___________________________</p>
`;
  
      // Mostrar el botón de descarga
      contractDownload.style.display = "block";
  
      // Notificar al usuario
      alert("Pago registrado y contrato generado exitosamente.");
    });
  
    // Descargar el contrato como PDF
downloadContractBtn.addEventListener("click", function () {
    const { jsPDF } = window.jspdf; // Usamos la librería jsPDF para generar PDFs
    const doc = new jsPDF();
  
    // Configurar el contenido del contrato
    let yPosition = 10; // Posición vertical inicial
    const lineHeight = 6; // Espaciado entre líneas
  
    // Agregar título
    doc.setFontSize(18);
    doc.text("Contrato de Alquiler", 10, yPosition);
    yPosition += 10;
  
    // Agregar detalles del contrato
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += lineHeight;
  
    doc.text(`Propiedad: ${document.getElementById("property").value}`, 10, yPosition);
    yPosition += lineHeight;
  
    doc.text(`Inquilino: ${document.getElementById("tenantName").value} (${document.getElementById("tenantEmail").value})`, 10, yPosition);
    yPosition += lineHeight;
  
    doc.text(`Monto del Pago: $${parseFloat(document.getElementById("amount").value).toFixed(2)}`, 10, yPosition);
    yPosition += lineHeight;
  
    doc.text(`Fecha del Pago: ${new Date(document.getElementById("date").value).toLocaleDateString()}`, 10, yPosition);
    yPosition += lineHeight;
  
    doc.text(`Descripción: ${document.getElementById("description").value || "Sin descripción"}`, 10, yPosition);
    yPosition += lineHeight;
  
    // Agregar términos y condiciones
    doc.setFontSize(14);
    doc.text("Términos y Condiciones", 10, yPosition);
    yPosition += 8;
  
    doc.setFontSize(12);
    const terms = [
      "1. El inquilino se compromete a pagar el monto acordado en la fecha especificada.",
      "2. El propietario garantiza que la propiedad estará disponible en las condiciones acordadas.",
      "3. Cualquier incumplimiento será notificado por escrito."
    ];
  
    terms.forEach(term => {
      doc.text(term, 10, yPosition);
      yPosition += lineHeight;
    });
  
    // Agregar firmas
    yPosition += 10;
    doc.text("Firma del Propietario: ___________________________", 10, yPosition);
    yPosition += lineHeight;
  
    doc.text("Firma del Inquilino: ___________________________", 10, yPosition);
  
    // Guardar el archivo como PDF
    doc.save("Contrato_Alquiler.pdf");
  });
  });