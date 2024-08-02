<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import type { InputPdfFile } from './FileContainer.vue';

type PdfFileListEmits = {
  remove: [file: InputPdfFile];
  configure: [file: InputPdfFile];
};

const inputFiles = defineModel<InputPdfFile[]>({
  required: true
});
defineEmits<PdfFileListEmits>();
</script>

<template>
  <VueDraggable v-model="inputFiles" class="flex" scroll target=".sort-target">
    <TransitionGroup
      type="transition"
      tag="div"
      name="fade"
      class="sort-target flex gap-2 flex-wrap"
    >
      <PdfFileItem
        v-for="inputFile of inputFiles"
        :key="inputFile.file.name + inputFile.file.type + inputFile.file.size"
        :pdfFile="inputFile"
        @remove="$emit('remove', inputFile)"
        @configure="$emit('configure', inputFile)"
      />
    </TransitionGroup>
  </VueDraggable>
</template>
<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>
