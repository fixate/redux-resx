export const warning = message => {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
};
