const toastState = {
  timer: 0,
};

export async function copyTextToClipboard(text) {
  const value = String(text ?? '');
  if (!value) return false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fallback below for non-HTTPS or restricted contexts
    }
  }

  const ta = document.createElement('textarea');
  ta.value = value;
  ta.setAttribute('readonly', '');
  ta.setAttribute('aria-hidden', 'true');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  ta.style.opacity = '0';
  document.body.appendChild(ta);

  try {
    ta.select();
    return Boolean(document.execCommand?.('copy'));
  } catch {
    return false;
  } finally {
    ta.remove();
  }
}

function getOrCreateCopyToast() {
  let toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  return toast;
}

export function showCopyToast(message, durationMs = 1800) {
  const toast = getOrCreateCopyToast();
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastState.timer);
  toastState.timer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, durationMs);
}

export function bindCopyButton(button, textOrGetter, options = {}) {
  if (!button) return () => {};

  const {
    copiedLabel = null,
    labelSelector = 'span',
    copiedDurationMs = 2000,
    toastMessage = null,
  } = options;

  const labelEl = copiedLabel ? button.querySelector(labelSelector) : null;
  const defaultLabel = labelEl ? labelEl.textContent : '';
  let resetTimer = 0;
  let flashTimer = 0;

  const handleClick = async () => {
    const text =
      typeof textOrGetter === 'function' ? textOrGetter(button) : textOrGetter;
    await copyTextToClipboard(text);

    button.classList.add('just-copied');
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => button.classList.remove('just-copied'), 700);

    if (labelEl && copiedLabel) {
      labelEl.textContent = copiedLabel;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        labelEl.textContent = defaultLabel;
      }, copiedDurationMs);
    }

    if (toastMessage) {
      const msg =
        typeof toastMessage === 'function' ? toastMessage(text) : toastMessage;
      if (msg) showCopyToast(msg);
    }
  };

  button.addEventListener('click', handleClick);

  return () => {
    clearTimeout(resetTimer);
    clearTimeout(flashTimer);
    button.removeEventListener('click', handleClick);
  };
}

export function initPaletteCopy(root = document) {
  const unbinders = [...root.querySelectorAll('[data-copy-hex]')].map((el) =>
    bindCopyButton(el, () => el.dataset.copyHex, {
      toastMessage: (hex) => `Color copiado: ${hex}`,
    })
  );

  return () => {
    unbinders.forEach((unbind) => unbind());
  };
}
