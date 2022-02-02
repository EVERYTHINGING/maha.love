<template>
  <div class="item">
    <p>{{ item.name }}</p>
    <Grid v-if="item.children" :items="item.children" />
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue'

export default {
  name: 'Item',
  components: { Grid },
  props: {
    item: Object
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
