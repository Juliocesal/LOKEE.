// Mode.js
document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    const state = {
      currentStep: 1,
      totalSteps: 3,
      formData: {
        personal: {},
        preferences: null,
        verification: {
          emailVerified: false,
          idUploaded: false
        }
      },
      temp: {
        emailCode: null,
        verificationAttempts: 0
      }
    };
  
    // Referencias del DOM
    const dom = {
      steps: document.querySelectorAll('.form-step'),
      nextBtn: document.getElementById('nextBtn'),
      prevBtn: document.getElementById('prevBtn'),
      submitBtn: document.getElementById('submitBtn'),
      progressSteps: document.querySelectorAll('.progress-steps .step'),
      avatarInput: document.getElementById('avatarInput'),
      avatarPreview: document.getElementById('avatarPreview'),
      preferenceCards: document.querySelectorAll('.pref-card'),
      verificationEmailBtn: document.querySelector('.verification-item [aria-label="Enviar código de verificación al correo electrónico"]'),
      idInput: document.querySelector('#idUpload input[type="file"]')
    };
  
    // Inicialización
    init();
  
    function init() {
      setupEventListeners();
      showStep(state.currentStep);
      updateProgress();
    }
  
    function setupEventListeners() {
      dom.nextBtn.addEventListener('click', handleNextStep);
      dom.prevBtn.addEventListener('click', handlePreviousStep);
      dom.submitBtn.addEventListener('click', handleFormSubmit);
      dom.avatarInput.addEventListener('change', handleAvatarUpload);
      dom.preferenceCards.forEach(card => {
        card.addEventListener('click', handlePreferenceSelection);
      });
      dom.verificationEmailBtn.addEventListener('click', handleEmailVerification);
      dom.idInput.addEventListener('change', handleIdUpload);
      
      // Validación en tiempo real
      document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', handleRealTimeValidation);
      });
    }
  
    // Navegación entre pasos
    function handleNextStep() {
      if (validateStep(state.currentStep)) {
        state.currentStep++;
        showStep(state.currentStep);
        updateProgress();
      }
    }
  
    function handlePreviousStep() {
      state.currentStep--;
      showStep(state.currentStep);
      updateProgress();
    }
  
    function showStep(step) {
      dom.steps.forEach((stepElement, index) => {
        const isActive = (index + 1) === step;
        stepElement.hidden = !isActive;
        stepElement.classList.toggle('active', isActive);
        stepElement.setAttribute('aria-hidden', !isActive);
      });
  
      // Actualizar controles de navegación
      dom.prevBtn.hidden = step === 1;
      dom.nextBtn.hidden = step === state.totalSteps;
      dom.submitBtn.hidden = step !== state.totalSteps;
    }
  
    function updateProgress() {
      dom.progressSteps.forEach((step, index) => {
        const isActive = (index + 1) <= state.currentStep;
        step.classList.toggle('active', isActive);
        step.setAttribute('aria-current', isActive ? 'step' : false);
      });
    }
  
    // Validaciones
    function validateStep(step) {
      let isValid = true;
      const currentStepElement = dom.steps[step - 1];
  
      switch(step) {
        case 1:
          isValid = validatePersonalInfo();
          break;
        case 2:
          isValid = validatePreferences();
          break;
        case 3:
          isValid = validateVerification();
          break;
      }
  
      currentStepElement.querySelectorAll('.invalid').forEach(el => {
        el.classList.remove('invalid');
      });
  
      if (!isValid) {
        showToast('Por favor completa todos los campos requeridos', 'error');
      }
  
      return isValid;
    }
  
    function validatePersonalInfo() {
      let isValid = true;
      
      const nameInput = document.getElementById('fullName');
      if (!nameInput.value.trim()) {
        markInvalid(nameInput);
        isValid = false;
      }
  
      const phoneInput = document.getElementById('phone');
      if (!phoneInput.value.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
        markInvalid(phoneInput);
        isValid = false;
      }
  
      return isValid;
    }
  
    function validatePreferences() {
      if (!state.formData.preferences) {
        showToast('Por favor selecciona un tipo de propiedad', 'error');
        return false;
      }
      return true;
    }
  
    function validateVerification() {
      if (!state.formData.verification.emailVerified) {
        showToast('Por favor verifica tu correo electrónico', 'error');
        return false;
      }
  
      if (!state.formData.verification.idUploaded) {
        showToast('Por favor sube tu identificación', 'error');
        return false;
      }
  
      return true;
    }
  
    function markInvalid(element) {
      element.classList.add('invalid');
      element.focus();
    }
  
    // Manejo de archivos
    async function handleAvatarUpload(event) {
      try {
        const file = event.target.files[0];
        if (!file) return;
  
        if (!file.type.startsWith('image/')) {
          throw new Error('Formato de archivo no válido');
        }
  
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('El archivo no debe exceder 2MB');
        }
  
        const processedImage = await processImage(file);
        dom.avatarPreview.src = URL.createObjectURL(processedImage);
        state.formData.personal.avatar = processedImage;
      } catch (error) {
        showToast(error.message, 'error');
        dom.avatarInput.value = '';
      }
    }
  
    async function processImage(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
  
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const MAX_SIZE = 512;
            
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
              if (width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              }
            } else {
              if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
  
            canvas.toBlob(resolve, 'image/jpeg', 0.8);
          };
        };
        reader.readAsDataURL(file);
      });
    }
  
    // Preferencias
    function handlePreferenceSelection(event) {
      const selectedCard = event.currentTarget;
      const propertyType = selectedCard.dataset.propertyType;
  
      dom.preferenceCards.forEach(card => {
        card.classList.remove('active');
      });
  
      selectedCard.classList.add('active');
      state.formData.preferences = propertyType;
    }
  
    // Verificación
    async function handleEmailVerification() {
      try {
        if (state.temp.verificationAttempts >= 3) {
          throw new Error('Límite de intentos alcanzado');
        }
  
        const code = Math.floor(100000 + Math.random() * 900000);
        state.temp.emailCode = code;
        state.temp.verificationAttempts++;
  
        // Simular envío de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        showToast(`Código enviado: ${code} (Simulación)`, 'info');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  
    function handleIdUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showToast('Formato de archivo no válido', 'error');
        event.target.value = '';
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) {
        showToast('El archivo no debe exceder 5MB', 'error');
        event.target.value = '';
        return;
      }
  
      state.formData.verification.idUploaded = true;
      showToast('Identificación subida correctamente', 'success');
    }
  
    // Envío del formulario
    function handleFormSubmit(event) {
      event.preventDefault();
  
      if (validateStep(state.currentStep)) {
        // Simular envío
        console.log('Datos enviados:', state.formData);
        showToast('Registro completado exitosamente!', 'success');
        resetForm();
      }
    }
  
    function resetForm() {
      state.currentStep = 1;
      state.formData = {
        personal: {},
        preferences: null,
        verification: {
          emailVerified: false,
          idUploaded: false
        }
      };
  
      document.getElementById('profileForm').reset();
      dom.avatarPreview.src = 'default-avatar.jpg';
      dom.preferenceCards.forEach(card => card.classList.remove('active'));
      showStep(1);
      updateProgress();
    }
  
    // Utilidades
    function handleRealTimeValidation(event) {
      const input = event.target;
      input.classList.remove('invalid');
    }
  
    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toast.setAttribute('role', 'alert');
  
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        backgroundColor: type === 'error' ? '#dc2626' : type === 'success' ? '#22c55e' : '#3b82f6',
        color: 'white',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out'
      });
  
      document.body.appendChild(toast);
  
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  
    // Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registrado:', registration.scope);
          })
          .catch(err => {
            console.error('Error registrando ServiceWorker:', err);
          });
      });
    }
  });