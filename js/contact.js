// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', function() {
  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Message Sent!';
  btn.style.background = 'var(--accent)';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
  }, 3000);
});
