export function createTimer() {
  const timers = new Set();
  return {
    setTimeout: (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    },
    clearAll: () => {
      timers.forEach(id => clearTimeout(id));
      timers.clear();
    },
  };
}
