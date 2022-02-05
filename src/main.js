import { createApp } from 'vue'
import App from './App.vue'
import Grid from '@/components/Grid.vue'
import Item from '@/components/Item.vue'

const app = createApp(App);

app.component("Grid", Grid);
app.component("Item", Item);

createApp(App).mount('#app')