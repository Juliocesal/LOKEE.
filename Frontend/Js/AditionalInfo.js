class RegistrationFlow {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.formData = new FormData();
    this.init();
  }

  init() {
    // Initialize step navigation
    this.initNavigation();
    // Initialize file uploads
    this.initFileUploads();
    // Initialize input masking
    this.initInputMasking();
    // Initialize skip button
    document.querySelector('.skip-button').addEventListener('click', this.handleSkip.bind(this));
  }

  initNavigation() {
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.previous');

    nextButton.addEventListener('click', async (e) => {
      if (await this.validateCurrentStep()) {
        this.goToStep(this.currentStep + 1);
      }
    });

    prevButton.addEventListener('click', () => this.goToStep(this.currentStep - 1));
  }

  initFileUploads() {
    // Profile picture upload
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.formData.set('avatar', file);
        this.showImagePreview(file, document.querySelector('.avatar-preview'));
      }
    });

    // ID document upload
    const idDocument = document.getElementById('idDocument');
    idDocument.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.formData.set('id_document', file);
      }
    });
  }
  
  validateAddress() {
    const requiredFields = [
      'streetAddress',
      'city',
      'zipCode',
      'country'
    ];
  
    for (const field of requiredFields) {
      const value = document.getElementById(field).value.trim();
      if (!value) {
        this.showError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
  
    const zipCode = document.getElementById('zipCode').value;
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      this.showError('Please enter a valid ZIP code');
      return false;
    }
  
    return true;
  }
  
  async submitForm(skipped = false) {
    // Add address data to formData
    const addressFields = {
      streetAddress: document.getElementById('streetAddress').value,
      city: document.getElementById('city').value,
      zipCode: document.getElementById('zipCode').value,
      country: document.getElementById('country').value
    };
  
    for (const [key, value] of Object.entries(addressFields)) {
      this.formData.append(key, value);
    }
  
    // Rest of existing submit logic
  }

  initInputMasking() {
    // Phone number masking
    IMask(document.getElementById('phoneNumber'), {
      mask: '+{1} (000) 000-0000'
    });

    // Card number masking
    IMask(document.getElementById('cardNumber'), {
      mask: '0000 0000 0000 0000'
    });

    // Expiry date masking
    IMask(document.getElementById('expiryDate'), {
      mask: 'MM/YY',
      blocks: {
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12
        },
        YY: {
          mask: IMask.MaskedRange,
          from: 24,
          to: 40
        }
      }
    });
  }

  async validateCurrentStep() {
    console.log(`Validating step ${this.currentStep}`);
  
    let isValid = false;
  
    switch (this.currentStep) {
      case 1:
        isValid = this.formData.has('avatar');
        console.log(`Step 1 validation result: ${isValid}`);
        break;
      case 2:
        const phone = document.getElementById('phoneNumber').value;
        isValid = /^\+1 \(\d{3}\) \d{3}-\d{4}$/.test(phone);
        console.log(`Step 2 validation result: ${isValid}`);
        break;
      case 3:
        isValid = this.formData.has('id_document');
        console.log(`Step 3 validation result: ${isValid}`);
        break;
      case 4:
        isValid = this.validatePayment();
        console.log(`Step 4 validation result: ${isValid}`);
        break;
      case 5:
        isValid = this.validateAddress();
        console.log(`Step 5 validation result: ${isValid}`);
        break;
    }
  
    return isValid;
  }

  validatePayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cvc = document.getElementById('cvc').value;
  
    // Registrar los valores ingresados
    console.log(`Card number entered: "${cardNumber}"`);
    console.log(`CVC entered: "${cvc}"`);
  
    // Validar el número de tarjeta
    let isCardNumberValid = false;
    let cardType = '';
  
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
      cardType = 'Visa';
      isCardNumberValid = true;
    } else if (/^5[1-5][0-9]{14}$/.test(cardNumber)) {
      cardType = 'MasterCard';
      isCardNumberValid = true;
    } else if (/^3[47][0-9]{13}$/.test(cardNumber)) {
      cardType = 'American Express';
      isCardNumberValid = true;
    } else if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)) {
      cardType = 'Discover';
      isCardNumberValid = true;
    }
  
    console.log(`Card type detected: ${cardType || 'Unknown'}`);
    console.log(`Card number validation result: ${isCardNumberValid}`);
  
    // Validar el CVC
    const isCvcValid = /^[0-9]{3,4}$/.test(cvc); // Acepta 3 o 4 dígitos (American Express usa 4 dígitos)
    console.log(`CVC validation result: ${isCvcValid}`);
  
    // Mostrar mensajes de error específicos
    if (!isCardNumberValid) {
      alert('Please enter a valid card number. Supported cards: Visa, MasterCard, American Express, Discover.');
      return false;
    }
  
    if (!isCvcValid) {
      alert('Please enter a valid CVC (3 or 4 digits).');
      return false;
    }
  
    // Si todo es válido, retornar true
    return true;
  }

  async goToStep(step) {
    // Update progress bar
    document.querySelector('.progress-bar').style.width = `${(step / this.totalSteps) * 100}%`;
    
    // Toggle step visibility
    document.querySelector(`[data-step="${this.currentStep}"]`).hidden = true;
    document.querySelector(`[data-step="${step}"]`).hidden = false;
    
    this.currentStep = step;
    this.updateNavigation();
  }

  updateNavigation() {
    const prevButton = document.querySelector('.previous');
    prevButton.hidden = this.currentStep === 1;
    
    const nextButton = document.querySelector('.next');
    nextButton.textContent = this.currentStep === this.totalSteps ? 'Submit' : 'Next';
    if (!nextButton) {
      console.error('Botón "Next" no encontrado');
    }

    
  }

  showImagePreview(file, container) {
    const reader = new FileReader();
    reader.onload = (e) => {
      container.style.backgroundImage = `url(${e.target.result})`;
      container.querySelector('.upload-instruction').hidden = true;
    };
    reader.readAsDataURL(file);
  }

  handleSkip() {
    if (confirm('Are you sure you want to skip completing your profile?')) {
      this.submitForm(true);
    }
  }

  async submitForm(skipped = false) {
    try {
        // Agregar campos de texto al FormData
        const addressFields = {
            phoneNumber: document.getElementById('phoneNumber').value,
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            expiryDate: document.getElementById('expiryDate').value,
            cvc: document.getElementById('cvc').value,
            streetAddress: document.getElementById('streetAddress').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value
        };

        for (const [key, value] of Object.entries(addressFields)) {
            this.formData.append(key, value);
        }

        // Enviar los datos al backend
        const response = await fetch('/api/complete-profile', {
            method: 'POST',
            body: this.formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error('Submission failed');

        // Redirigir al usuario
        window.location.href = skipped ? '/Frontend/Html/index.html' : '/Frontend/Html/profile-completed.html';
    } catch (error) {
        this.showError('Failed to save profile. Please try again.');
    }
}

showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.color = 'red';
  errorElement.style.marginBottom = '10px';

  const activeStep = document.querySelector('.step.active');
  activeStep.prepend(errorElement);

  setTimeout(() => errorElement.remove(), 3000);
}
}
// Initialize the flow
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationFlow();
});