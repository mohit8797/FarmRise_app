// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const toggleText = document.getElementById('toggleText');
const loginOptions = document.getElementById('loginOptions');
const farmerBtn = document.getElementById('farmerBtn');
const buyerBtn = document.getElementById('buyerBtn');

// State
let isLogin = true;
let showPassword = false;
let selectedRole = 'buyer';

// Validation Functions
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Event Handlers
const toggleAuthMode = () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Welcome Back' : 'Join FarmRise';
  authSubtitle.textContent = isLogin
    ? 'Sign in to your account'
    : 'Create your account';
  submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
  toggleText.textContent = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';
  toggleModeBtn.textContent = isLogin ? 'Sign Up' : 'Sign In';
  loginOptions.style.display = isLogin ? 'flex' : 'none';
  
  // Clear form and errors
  authForm.reset();
  emailError.textContent = '';
  passwordError.textContent = '';
};

const togglePasswordVisibility = () => {
  showPassword = !showPassword;
  passwordInput.type = showPassword ? 'text' : 'password';
  const icon = togglePasswordBtn.querySelector('i');
  icon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
  lucide.createIcons();
};

const handleRoleSelection = (role) => {
  selectedRole = role;
  farmerBtn.classList.toggle('active', role === 'farmer');
  buyerBtn.classList.toggle('active', role === 'buyer');
};

const validateForm = () => {
  let isValid = true;
  
  // Email validation
  if (!isValidEmail(emailInput.value)) {
    emailError.textContent = 'Please enter a valid email address';
    isValid = false;
  } else {
    emailError.textContent = '';
  }

  // Password validation (only check strength for signup)
  if (!isLogin && !isValidPassword(passwordInput.value)) {
    passwordError.textContent =
      'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters';
    isValid = false;
  } else {
    passwordError.textContent = '';
  }

  return isValid;
};

// Event Listeners
toggleModeBtn.addEventListener('click', toggleAuthMode);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
farmerBtn.addEventListener('click', () => handleRoleSelection('farmer'));
buyerBtn.addEventListener('click', () => handleRoleSelection('buyer'));

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    // Form data for submission
    const formData = {
      email: emailInput.value,
      password: passwordInput.value,
      role: selectedRole,
      mode: isLogin ? 'login' : 'signup',
      rememberMe: document.getElementById('rememberMe')?.checked || false
    };
    
    // Log form data (replace with your authentication logic)
    console.log('Form submitted:', formData);
  }
});