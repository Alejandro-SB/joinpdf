<script setup lang="ts">
import { mergeDocuments } from '@/utils/pdfUtils';
import { Ok, Err, type Result } from 'pratica';
import { useToast } from 'primevue/usetoast';

export type InputPdfFile = {
  file: File;
  pages?: string;
};

const highLightClassName = 'file-container-highlight';

const files = ref<InputPdfFile[]>([]);
const fileRef = ref<HTMLInputElement | null>(null);
const showConfigurator = ref(false);
const selectedFile = ref<InputPdfFile>();
const toast = useToast();

const onFilesChanged = (event: Event) => {
  const { files: inputFiles } = event.target as HTMLInputElement;

  processFiles(toFiles(inputFiles));
};

const processFiles = (inputFiles: File[]) => {
  const validatedFiles = inputFiles.map<Result<File, File>>((f) =>
    f.type === 'application/pdf' ? Ok(f) : Err(f)
  );

  for (let validatedFile of validatedFiles) {
    validatedFile.cata({
      Ok: (f) =>
        files.value.push({
          file: f
        }),
      Err: (f) =>
        toast.add({
          detail: `Error in file ${f.name}`,
          severity: 'error'
        })
    });
  }
};

const clearFiles = () => (files.value = []);
const openPicker = () => fileRef.value?.click();
const mergeFiles = async () => {
  const newPdf = await mergeDocuments(files.value);
  const url = URL.createObjectURL(newPdf);

  window.open(url);
};

const onRemove = (file: InputPdfFile) => (files.value = files.value.filter((f) => f !== file));
const configureItem = (file: InputPdfFile) => {
  showConfigurator.value = true;
  selectedFile.value = file;
};
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  toggleHighlight(e, true);
};

const onDragLeave = (e: DragEvent) => {
  e.preventDefault();

  toggleHighlight(e, false);
};

const onDrop = (event: DragEvent) => {
  event.stopPropagation();
  event.preventDefault();
  toggleHighlight(event, false);

  const files = event.dataTransfer?.files;

  processFiles(toFiles(files));
};

const toggleHighlight = (e: DragEvent, enable: boolean) => {
  const target = e.target as HTMLElement;

  const el = target.classList.contains('file-container-content')
    ? target
    : target.closest<HTMLElement>('.file-container-content')!;

  enable ? el.classList.add(highLightClassName) : el.classList.remove(highLightClassName);
};

const toFiles = (fileList: FileList | null | undefined) => [...(fileList || [])];
</script>

<template>
  <div class="file-container">
    <PdfConfigurationModal v-model="showConfigurator" :file="selectedFile"></PdfConfigurationModal>
    <div class="file-container-header">
      <PdfContainerHeader
        :has-files="files.length > 0"
        @clear="clearFiles()"
        @open="openPicker()"
        @merge="mergeFiles()"
      />
    </div>
    <div
      class="file-container-content"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="flex flex-col gap-8 pt-4" v-if="files.length > 0">
        <div v-if="files.length > 0">
          <div class="flex flex-wrap gap-4">
            <PdfFileList :inputFiles="files" @remove="onRemove" @configure="configureItem" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex items-center justify-center flex-col">
          <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
          <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </div>
    </div>
    <input
      ref="fileRef"
      type="file"
      class="hidden"
      @change="onFilesChanged"
      multiple
      accept="application/pdf"
    />
  </div>
</template>

<style scoped>
.file-container {
  border: 1px solid var(--p-fileupload-border-color);
  border-radius: var(--p-fileupload-border-radius);
  background: var(--p-fileupload-background);
  color: var(--p-fileupload-color);
}

.file-container-header {
  display: flex;
  align-items: center;
  padding: var(--p-fileupload-header-padding);
  background: var(--p-fileupload-header-background);
  color: var(--p-fileupload-header-color);
  border-style: solid;
  border-width: var(--p-fileupload-header-border-width);
  border-color: var(--p-fileupload-header-border-color);
  border-radius: var(--p-fileupload-header-border-radius);
  gap: var(--p-fileupload-header-gap);
}

.file-container-content {
  border: 1px solid transparent;
  position: relative;
  transition: border-color var(--p-fileupload-transition-duration);
  padding: var(--p-fileupload-content-padding);
}

.file-container-content.file-container-highlight {
  border: 1px dashed var(--p-fileupload-content-highlight-border-color);
}
</style>
