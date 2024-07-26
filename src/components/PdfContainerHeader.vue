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
        icon="pi pi-images"
        rounded
        outlined
        severity="secondary"
      ></Button>
      <Button
        @click="$emit('clear')"
        icon="pi pi-times"
        rounded
        outlined
        severity="danger"
        :disabled="!hasFiles"
      ></Button>
    </div>
    <div class="flex gap-2">
      <Button
        @click="$emit('merge')"
        icon="pi pi-file-export"
        rounded
        outlined
        severity="contrast"
        :disabled="!hasFiles"
      ></Button>
    </div>
  </div>
</template>
