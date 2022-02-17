<template>
  <Grid :items=items :isActive=true :parentGridIsActive=true />
</template>

<script>
import Grid from '@/components/Grid.vue'
import { renderQueue } from '@/RenderQueue.js'
const TWEEN = require('@tweenjs/tween.js')

export default {
  name: 'App',
  components: { Grid },
  data() {
    return {
      items: window.treeData.children
    }
  },
  mounted(){
    renderQueue.add(function(){ TWEEN.update(); })
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
