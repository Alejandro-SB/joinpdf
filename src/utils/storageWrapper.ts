export const setStorage = (key: string, value: string) =>
  localStorage && localStorage.setItem(key, value);

export const getStorage = (key: string) => localStorage && localStorage.getItem(key);
export const removeStorage = (key: string) => localStorage && localStorage.removeItem(key);
