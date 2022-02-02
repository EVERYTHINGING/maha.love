<template>
  <Grid :items=items />
</template>

<script>
import Grid from '@/components/Grid.vue'

export default {
  name: 'App',
  components: { Grid },
  data: function() {
    return {
      items: window.treeData
    }
  },
}
</script>

<style>
#app {

}
</style>
