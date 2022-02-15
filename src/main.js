import { createApp } from 'vue'
import App from './App.vue'
import Grid from '@/components/Grid.vue'
import Item from '@/components/Item.vue'
//import FPSMeter from 'fps-m';

/*
const fps = new FPSMeter({ui: true});
fps.start();
fps.element.classList.add('fps');
*/

const app = createApp(App);
app.component("Grid", Grid);
app.component("Item", Item);
createApp(App).mount('#app')