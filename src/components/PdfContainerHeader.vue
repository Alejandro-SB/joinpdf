<script setup lang="ts">
type PdfContainerHeaderEmits = {
  open: [];
  clear: [];
  merge: [];
};

type PdfContainerHeaderProps = {
  hasFiles: boolean;
};

defineEmits<PdfContainerHeaderEmits>();
defineProps<PdfContainerHeaderProps>();
</script>
<template>
  <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
    <div class="flex gap-2">
      <Button
        @click="$emit('open')"
        icon="pi pi-plus"
        v-tooltip.top="'Añadir ficheros'"
        severity="info"
      ></Button>
      <Button
        @click="$emit('clear')"
        icon="pi pi-times"
        :disabled="!hasFiles"
        severity="danger"
        v-tooltip.top="'Limpiar'"
      ></Button>
    </div>
    <div class="flex gap-2">
      <Button
        @click="$emit('merge')"
        icon="pi pi-file-export"
        :disabled="!hasFiles"
        v-tooltip.top="'Combinar'"
      ></Button>
    </div>
  </div>
</template>
