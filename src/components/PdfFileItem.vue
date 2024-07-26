<script setup lang="ts">
import { readFileAsync } from '@/utils/asyncFileReader';
import { createThumbnail } from '@/utils/pdfUtils';
import { getDocument } from 'pdfjs-dist';
import type { InputPdfFile } from './FileContainer.vue';

type PdfFileItemProps = {
  pdfFile: InputPdfFile;
};

type PdfFileItemEmits = {
  remove: [file: InputPdfFile];
  configure: [file: InputPdfFile];
};

const props = defineProps<PdfFileItemProps>();
const emits = defineEmits<PdfFileItemEmits>();

const thumbnail = ref();

onMounted(async () => {
  const file = await readFileAsync(props.pdfFile.file);
  const document = await getDocument(file).promise;
  const url = await createThumbnail(document);

  thumbnail.value = url;
});
</script>

<template>
  <div class="p-8 flex flex-col border rounded border-surface items-center gap-4">
    <div>
      <img :src="thumbnail" width="210" height="297" />
    </div>
    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
      pdfFile.file.name
    }}</span>
    <div class="flex gap-4">
      <Button
        icon="pi pi-cog"
        @click="$emit('configure', pdfFile)"
        outlined
        rounded
        severity="contrast"
      ></Button>
      <Button
        icon="pi pi-times"
        @click="emits('remove', props.pdfFile)"
        outlined
        rounded
        severity="danger"
      ></Button>
    </div>
  </div>
</template>
