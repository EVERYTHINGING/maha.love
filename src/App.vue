<template>
  <Grid :items=items :isActive=true />
</template>

<script>
import Grid from '@/components/Grid.vue'
import { TreeData } from '@/data.js'
import { renderQueue } from '@/RenderQueue.js'

export default {
  name: 'App',
  components: { Grid },
  data() {
    return {
      items: TreeData
    }
  },
  mounted(){
    renderQueue.start();
  }
}
</script>

<style>
body {
  background-color: black;
  color: white;
  font-size: 3em;
}

#app {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}

.fps {
  font-size: 30px !important;
  bottom: auto !important;
  top: 0px;
}
</style>
