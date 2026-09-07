import { validateForm, rules, clearErrors } from '../utils/validators.js';
import { toast } from '../components/ui.js';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    const ok = validateForm(form, {
      name: [rules.required],
      email: [rules.required, rules.email],
      subject: [rules.required],
      message: [rules.required, rules.minLen(10)]
    });
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.textContent = 'Message sent';
      toast.show("Thanks — we'll get back to you soon.");
      form.reset();
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1800);
    }, 700);
  });
}
