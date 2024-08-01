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
    <span class="font-semibold text-center text-ellipsis w-48 whitespace-nowrap overflow-hidden">{{
      pdfFile.file.name
    }}</span>
    <div class="flex gap-4">
      <OverlayBadge :class="{ 'hide-badge': !props.pdfFile.descriptor }">
        <Button
          icon="pi pi-cog"
          @click="$emit('configure', pdfFile)"
          raised
          severity="warn"
        ></Button>
      </OverlayBadge>
      <Button
        icon="pi pi-times"
        @click="emits('remove', props.pdfFile)"
        raised
        severity="danger"
      ></Button>
    </div>
  </div>
</template>
<style>
.hide-badge .p-badge-dot {
  display: none;
}
</style>
