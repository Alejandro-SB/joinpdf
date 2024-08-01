<script setup lang="ts">
import { getGeneratorsFromPageDescriptor } from '@/utils/pageSections';
import type { InputPdfFile } from './FileContainer.vue';

type PdfConfigurationModalProps = {
  file?: InputPdfFile;
};

const props = defineProps<PdfConfigurationModalProps>();

const show = defineModel({
  default: false
});

const newPages = ref('');

const generators = computed(() => getGeneratorsFromPageDescriptor(newPages.value));

const isValidPages = computed(
  () => generators.value === null || generators.value.every((g) => g.isOk())
);
const validationErrors = computed(() => generators.value?.find((g) => g.isErr())?.value() ?? '');

const onSave = () => {
  props.file!.pages = newPages.value;
  show.value = false;
};

watch(props, (nv) => {
  newPages.value = nv.file?.pages ?? '';
});
</script>

<template>
  <Dialog v-model:visible="show" :header="`Editando ${file?.file.name}`" style="width: 50rem">
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
