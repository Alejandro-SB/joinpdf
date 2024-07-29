<script setup lang="ts">
const darkMode = useDarkMode();
const toggleTheme = () => {
  darkMode.toggleMode();
};

const icon = computed(() => (darkMode.isDark.value ? 'pi pi-moon' : 'pi pi-sun'));
</script>

<template>
  <header class="flex w-full p-4 justify-between">
    <h1 class="text-4xl">Unir PDF</h1>
    <Button :icon="icon" @click="toggleTheme" v-tooltip.left="'Cambiar modo oscuro/claro'"></Button>
  </header>
</template>
