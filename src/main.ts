import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import ConfirmationService from 'primevue/confirmationservice';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

app.mount('#app');
