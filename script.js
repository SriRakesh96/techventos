(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const backToTop = document.querySelector('.back-to-top');
  const updateTopButton = () => backToTop?.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();

  // Close the mobile navigation after a section link is selected.
  document.querySelectorAll('#mainNav .nav-link, #mainNav .btn').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('mainNav');
      if (nav?.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  });

  // Reveal cards as they enter the viewport, with a graceful fallback.
  const revealTargets = document.querySelectorAll('.service-card, .project-card, .process-card, .blog-card, .quote-card, .benefit-list > div');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('in-view'));

  // Demo-only form: validate fields and prepare a mailto draft. For production,
  // replace this handler with a secure server-side endpoint or trusted form API.
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      formMessage.textContent = 'Please complete the required fields and check the consent box.';
      formMessage.className = 'mt-3 text-danger small';
      form.querySelector(':invalid')?.focus();
      return;
    }
    const data = new FormData(form);
    const subject = `Website enquiry from ${String(data.get('name')).trim()}`;
    const body = [
      `Name: ${String(data.get('name')).trim()}`,
      `Email: ${String(data.get('email')).trim()}`,
      `Phone: ${String(data.get('phone') || '').trim() || 'Not provided'}`,
      `Service: ${String(data.get('service') || '').trim() || 'Not specified'}`,
      '', 'Project details:', String(data.get('message')).trim()
    ].join('\n');
    formMessage.textContent = 'Your email app will open with the enquiry prepared. Please send it to complete the submission.';
    formMessage.className = 'mt-3 text-success small';
    window.location.href = `mailto:info@techventos.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

// Multi-page contact form email fallback. Replace with a server endpoint for production.
document.getElementById('contactForm')?.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = new FormData(this);
  const subject = encodeURIComponent('TechVentos project enquiry - ' + (data.get('service') || 'General'));
  const body = encodeURIComponent('Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\nPhone: ' + (data.get('phone') || 'Not provided') + '\nService: ' + data.get('service') + '\n\nProject details:\n' + data.get('message'));
  const status = document.getElementById('formMessage');
  if (status) status.textContent = 'Opening your email application with the enquiry details…';
  window.location.href = 'mailto:info@techventos.com?subject=' + subject + '&body=' + body;
});
