const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();


const bookingForm = document.getElementById('bookingForm');
const quantitySelect = document.getElementById('quantity');
const bookingTotal = document.getElementById('bookingTotal');
const bookingMessage = document.getElementById('bookingMessage');
const deliveryDate = document.getElementById('deliveryDate');
const bagPrice = 1499;

// Prevent selecting a delivery date in the past.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
deliveryDate.min = localToday;

function updateBookingTotal() {
  const total = bagPrice * Number(quantitySelect.value);
  bookingTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}
quantitySelect.addEventListener('change', updateBookingTotal);

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const formData = new FormData(bookingForm);
  const name = String(formData.get('fullName')).trim();
  const quantity = Number(formData.get('quantity'));
  const total = bagPrice * quantity;
  const reference = `TB${Date.now().toString().slice(-8)}`;
  bookingMessage.hidden = false;
  bookingMessage.textContent = `Thanks, ${name}! Your demo booking request (${reference}) is ready for ${quantity} bag${quantity > 1 ? 's' : ''}. Estimated total: ₹${total.toLocaleString('en-IN')}. No payment has been taken and this request has not been sent to a server.`;
  bookingMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
