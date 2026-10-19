const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Prevent choosing a date in the past.
const bookingDate = document.getElementById('bookingDate');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split('T')[0];
bookingDate.min = localToday;

document.getElementById('bookingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const customer = String(data.get('customerName')).trim();
  const flavour = data.get('flavour');
  const weight = data.get('weight');
  const date = data.get('date');
  document.getElementById('bookingMessage').textContent =
    `Thank you, ${customer}! Your ${weight} ${flavour} cake request for ${date} has been prepared in this demo. Please call us to confirm.`;
  form.reset();
  bookingDate.min = localToday;
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('loginMessage').textContent =
    'Demo only: the form works in your browser, but real login needs a secure backend.';
  event.currentTarget.reset();
});
