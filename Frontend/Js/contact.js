// Funcionalidad del formulario de contacto
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const responseMessage = document.getElementById("response-message");
  
    // Escuchar el evento de envío del formulario
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  
      // Obtener los valores de los campos
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();
  
      // Validar que los campos requeridos no estén vacíos
      if (!name || !email || !message) {
        responseMessage.textContent = "Por favor, completa todos los campos obligatorios.";
        responseMessage.style.color = "#d32f2f"; // Rojo para errores
        return;
      }
  
      // Simular el envío de datos (puedes reemplazar esto con una llamada a una API real)
      try {
        responseMessage.textContent = "Enviando mensaje..."; // Mensaje de carga
        responseMessage.style.color = "#0277bd"; // Azul para mensajes neutrales
  
        // Simulación de envío (usando setTimeout)
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2 segundos
  
        // Si todo sale bien, mostrar mensaje de éxito
        responseMessage.textContent = "¡Mensaje enviado con éxito!";
        responseMessage.style.color = "#2e7d32"; // Verde para éxito
  
        // Limpiar el formulario
        form.reset();
      } catch (error) {
        // Manejar errores
        responseMessage.textContent = "Ocurrió un error al enviar el mensaje. Por favor, intenta nuevamente.";
        responseMessage.style.color = "#d32f2f"; // Rojo para errores
      }
    });
  });