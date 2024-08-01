<script setup lang="ts">
import { getPageDescriptorFromRawDescriptor } from '@/utils/pageSections';
import type { InputPdfFile } from './FileContainer.vue';

type PdfConfigurationModalProps = {
  file?: InputPdfFile;
};

const props = defineProps<PdfConfigurationModalProps>();

const show = defineModel({
  default: false
});

const newPages = ref('');

const pageDescriptor = computed(() =>
  getPageDescriptorFromRawDescriptor(newPages.value, props.file?.totalPages ?? 0)
);

const isValidPages = computed(() => pageDescriptor.value.isOk() || !newPages.value);
const validationErrors = computed(() =>
  pageDescriptor.value.isErr() ? pageDescriptor.value.value() : ''
);

const onSave = () => {
  props.file!.descriptor = pageDescriptor.value.cata({
    Ok: (d) => d,
    Err: () => undefined
  });
  show.value = false;
};

watch(props, (nv) => {
  newPages.value = nv.file?.descriptor?.raw ?? '';
});
</script>

<template>
  <Dialog
    v-model:visible="show"
    :header="`Editando ${file?.file.name}. Total páginas: ${file?.totalPages}`"
    style="width: 50rem"
  >
    <p>
      Vacío implica que se copiarán todas. Se pueden especificar rangos con un guión, e. g. 3-5. Se
      pueden especificar páginas específicas con el número, e. g. 4, 5. Cada uno de los segmentos
      debe ir separado con una coma.
    </p>
    <div class="flex items-center gap-4 mb-8">
      <label for="pages" class="font-semibold w-24">Páginas</label>
      <InputText id="pages" class="flex-auto" autocomplete="off" v-model="newPages" />
      <span class="text-red-500">{{ validationErrors }}</span>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="show = false"></Button>
      <Button type="button" label="Save" @click="onSave" :disabled="!isValidPages"></Button>
    </div>
  </Dialog>
</template>
