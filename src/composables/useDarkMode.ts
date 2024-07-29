import { getStorage, removeStorage, setStorage } from '@/utils/storageWrapper';

const localStorageKey = 'joinpdf.isDark';
const prefersDarkMode =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useDarkMode = () => {
  const initialDarkMode = !!getStorage(localStorageKey) || prefersDarkMode;
  const isDark = ref(initialDarkMode);

  if (isDark.value) {
    document.documentElement.classList.add('dark');
  }

  const toggleMode = () => {
    isDark.value = !isDark.value;

    if (isDark.value) {
      setStorage(localStorageKey, 'dark');
    } else {
      removeStorage(localStorageKey);
    }

    document.documentElement.classList.toggle('dark');
  };

  return {
    isDark,
    toggleMode
  };
};
