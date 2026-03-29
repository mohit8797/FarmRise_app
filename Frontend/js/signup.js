/**
 * FarmRise Signup Module
 * Handles user registration with backend API
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const errorElements = {
    fullName: document.getElementById('fullNameError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    phoneNumber: document.getElementById('phoneNumberError'),
  };

  // Validation functions
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.get('fullName').trim()) errors.fullName = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
      errors.email = 'Please enter a valid email';
    }
    if (formData.get('password').length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.get('password') !== formData.get('confirmPassword')) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!/^\+?[\d\s-()]+$/.test(formData.get('phoneNumber'))) {
      errors.phoneNumber = 'Invalid phone number';
    }

    return errors;
  };

  const displayErrors = (errors) => {
    Object.values(errorElements).forEach((el) => (el.textContent = ''));
    Object.entries(errors).forEach(([field, message]) => {
      errorElements[field].textContent = message;
    });
  };

  // Show notification helper
  function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${type === 'error' ? '#f44336' : '#4CAF50'};
      color: white;
      border-radius: 4px;
      z-index: 10000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Creating account...';

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            role: formData.get('role'),
            phoneNumber: formData.get('phoneNumber'),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          showNotification('Account created! Redirecting to login...', 'success');
          setTimeout(() => {
            window.location.href = '/Frontend/login.html';
          }, 1500);
        } else {
          // Handle specific field errors
          if (data.message.includes('Email')) {
            displayErrors({ email: data.message });
          } else if (data.message.includes('Password')) {
            displayErrors({ password: data.message });
          } else {
            showNotification(data.message || 'Signup failed', 'error');
          }
        }
      } catch (error) {
        console.error('Signup error:', error);
        showNotification('Connection error. Please try again.', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign Up';
      }
    } else {
      displayErrors(errors);
    }
  });

  // Clear error messages on input
  form.querySelectorAll('input').forEach((input) =>
    input.addEventListener('input', () => {
      if (errorElements[input.name]) errorElements[input.name].textContent = '';
    })
  );
});