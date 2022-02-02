<template>
  <div class="grid">
    <template v-for="(item, index) in items" :key=index>
      <Item :item=item />
    </template>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'Grid',
  components: {
    Item: defineAsyncComponent(() => import('@/components/Item.vue'))
  },
  props: {
    items: Array
  }
}
</script>

<style scoped>
.grid {
  margin-left: 100px;
}
</style>
