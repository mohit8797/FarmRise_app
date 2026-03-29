/**
 * FarmRise Login Module
 * Handles user authentication with backend API
 */

// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const roleButtons = document.querySelectorAll('.role-btn');

let selectedRole = 'buyer';

// Role selection
roleButtons.forEach(button => {
  button.addEventListener('click', () => {
    roleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedRole = button.getAttribute('data-role');
  });
});

// Show/hide password toggle
togglePasswordBtn.addEventListener('click', () => {
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  togglePasswordBtn.querySelector('i').setAttribute(
    'data-lucide',
    passwordInput.type === 'password' ? 'eye' : 'eye-off'
  );
  lucide.createIcons();
});

// Validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Login form submit event
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  emailError.textContent = '';
  passwordError.textContent = '';

  // Validate email
  if (!isValidEmail(emailInput.value)) {
    emailError.textContent = 'Invalid email format';
    return;
  }

  // Validate password
  if (passwordInput.value.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters';
    return;
  }

  const submitButton = authForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Signing in...';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: emailInput.value,
        role: selectedRole,
        name: data.name || data.user?.name || emailInput.value
      }));

      showNotification('Login successful! Redirecting...', 'success');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/Frontend/dashboard.html';
      }, 1000);
    } else {
      passwordError.textContent = data.message || 'Invalid credentials';
      showNotification(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    passwordError.textContent = 'Connection error. Please check if the server is running.';
    showNotification('Connection error. Please try again.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Sign In';
  }
});

// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
  console.log('User already logged in');
  window.location.href = '/Frontend/dashboard.html';
}