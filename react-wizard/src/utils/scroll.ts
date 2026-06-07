export const scrollToElement = (id: string, delay: number = 100) => {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, delay);
};
