<script setup lang="ts">
import type { InputPdfFile } from './FileContainer.vue';

type PdfFileListProps = {
  inputFiles: InputPdfFile[];
};

type PdfFileListEmits = {
  remove: [file: InputPdfFile];
  configure: [file: InputPdfFile];
};

const props = defineProps<PdfFileListProps>();
defineEmits<PdfFileListEmits>();
</script>

<template>
  <PdfFileItem
    v-for="inputFile of props.inputFiles"
    :key="inputFile.file.name + inputFile.file.type + inputFile.file.size"
    :pdfFile="inputFile"
    @remove="$emit('remove', inputFile)"
    @configure="$emit('configure', inputFile)"
  />
</template>
