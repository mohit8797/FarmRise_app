document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const errorElements = {
      fullName: document.getElementById('fullNameError'),
      email: document.getElementById('emailError'),
      password: document.getElementById('passwordError'),
      confirmPassword: document.getElementById('confirmPasswordError'),
      phoneNumber: document.getElementById('phoneNumberError')
    };
  
    const validateForm = (formData) => {
      const errors = {};
      
      // Full Name validation
      if (!formData.get('fullName').trim()) {
        errors.fullName = 'Full name is required';
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.get('email'))) {
        errors.email = 'Please enter a valid email address';
      }
  
      // Password validation
      const password = formData.get('password');
      if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
  
      // Confirm password validation
      if (password !== formData.get('confirmPassword')) {
        errors.confirmPassword = 'Passwords do not match';
      }
  
      // Phone number validation
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(formData.get('phoneNumber'))) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
  
      return errors;
    };
  
    const displayErrors = (errors) => {
      // Clear all previous errors
      Object.values(errorElements).forEach(element => {
        if (element) element.textContent = '';
      });
  
      // Display new errors
      Object.entries(errors).forEach(([field, message]) => {
        const element = errorElements[field];
        if (element) {
          element.textContent = message;
          element.parentElement.classList.add('error-shake');
          setTimeout(() => {
            element.parentElement.classList.remove('error-shake');
          }, 500);
        }
      });
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const errors = validateForm(formData);
  
      if (Object.keys(errors).length === 0) {
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // Successful signup
            window.location.href = '/login';
          } else {
            // Server returned an error
            displayErrors({
              [data.field]: data.message
            });
          }
        } catch (error) {
          console.error('Signup error:', error);
          alert('An error occurred during signup. Please try again.');
        }
      } else {
        displayErrors(errors);
      }
    });
  
    // Clear error message when user starts typing
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        const errorElement = errorElements[input.name];
        if (errorElement) {
          errorElement.textContent = '';
        }
      });
    });
  });