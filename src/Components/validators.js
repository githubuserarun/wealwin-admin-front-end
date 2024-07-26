import { toast } from 'react-toastify';

export function validateUsername(username) {
  if (!username) {
    return "Username cannot be empty.";
  }

  if (username.length < 3 || username.length > 20) {
    toast.error("Username must be between 3 and 20 characters.");
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    toast.error("Username can only contain letters, numbers, and underscores.");
    return;
  }

  return null;
}

export function validatePassword(password) {
  if (!password) {
    return "Password cannot be empty.";
  }

  if (password.length < 8 || password.length > 20) {
    toast.error("Password must be between 8 and 20 characters.");
    return;
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
    toast.error("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
    return;
  }

  return null;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
}
