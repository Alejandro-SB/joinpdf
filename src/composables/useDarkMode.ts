import { getStorage, removeStorage, setStorage } from '@/utils/storageWrapper';

const localStorageKey = 'joinpdf.isDark';

export const useDarkMode = () => {
  const initialDarkMode = !!getStorage(localStorageKey);
  const isDark = ref(initialDarkMode);

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
