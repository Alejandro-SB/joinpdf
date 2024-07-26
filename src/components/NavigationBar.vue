<script setup lang="ts">
const darkMode = useDarkMode();
const toggleTheme = () => {
  darkMode.toggleMode();
};

const icon = computed(() => (darkMode.isDark.value ? 'pi pi-moon' : 'pi pi-sun'));
</script>

<template>
  <header class="flex w-full p-4 justify-end">
    <Button :icon="icon" @click="toggleTheme"></Button>
  </header>
</template>
