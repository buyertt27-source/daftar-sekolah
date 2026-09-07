// Validators — small, dependency-free field validation helpers.

export const rules = {
  required: (v) => v.trim().length > 0 || 'This field is required.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  phone: (v) => /^[0-9+()\-\s]{8,16}$/.test(v.trim()) || 'Enter a valid phone number.',
  minLen: (n) => (v) => v.trim().length >= n || `Must be at least ${n} characters.`,
  postal: (v) => /^[0-9]{4,6}$/.test(v.trim()) || 'Enter a valid postal code.',
  cardNumber: (v) => /^[0-9\s]{13,19}$/.test(v.trim()) || 'Enter a valid card number.',
  cardExpiry: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()) || 'Use MM/YY format.',
  cardCvc: (v) => /^[0-9]{3,4}$/.test(v.trim()) || 'Enter a valid CVC.'
};

/**
 * Validates a form element against a rule map: { fieldName: [rule, rule...] }
 * Toggles .has-error / .invalid classes and shows the .field-error message.
 * Returns true if the whole form is valid.
 */
export function validateForm(formEl, ruleMap) {
  let valid = true;
  Object.entries(ruleMap).forEach(([name, fieldRules]) => {
    const input = formEl.querySelector(`[name="${name}"]`);
    if (!input) return;
    const fieldWrap = input.closest('.field') || input;
    let message = null;

    for (const rule of fieldRules) {
      const result = rule(input.value || '');
      if (result !== true) { message = result; break; }
    }

    const errorEl = fieldWrap.querySelector?.('.field-error');
    if (message) {
      valid = false;
      fieldWrap.classList?.add('has-error');
      input.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    } else {
      fieldWrap.classList?.remove('has-error');
      input.classList.remove('invalid');
    }
  });
  return valid;
}

export function clearErrors(formEl) {
  formEl.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
  formEl.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
}
