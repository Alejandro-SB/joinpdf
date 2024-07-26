<script setup lang="ts">
import type { InputPdfFile } from './FileContainer.vue';

type PdfConfigurationModalProps = {
  file?: InputPdfFile;
};

defineProps<PdfConfigurationModalProps>();
const show = defineModel({
  default: false
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
      <InputText id="pages" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="show = false"></Button>
      <Button type="button" label="Save" @click="show = false"></Button>
    </div>
  </Dialog>
</template>
