<template>
  <!-- <h1 class="name">
    <span v-for="(char, index) in 'michaelparisi'" :key=index>{{ char }}</span>
  </h1> -->
  <Grid :items=items :isActive=true :parentGridIsActive=true :isMain=true />
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
  setup(){
    let first = { name: 'mich', children: [] };
    let second = { name: 'ael\u0020pa', children: [] };
    let third = { name: 'risi', children: [] };
    window.treeData.children.unshift(third);
    window.treeData.children.unshift(second);
    window.treeData.children.unshift(first);
  },
  mounted(){
    renderQueue.add(function(){ TWEEN.update(); })
    renderQueue.start();
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');

html, body {
  background-color: black;
  color: white;
  font-size: 1vw;
  font-family: 'Major Mono Display';
  /* background-image: url(/images/bg.png); */
  /* background: -webkit-radial-gradient(circle, #2C5364, #203A43, #0F2027);
  background: radial-gradient(circle, #2C5364, #203A43, #0F2027); */
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

h1 {
  letter-spacing: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 0.5em;
}
</style>
