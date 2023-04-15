<template>
  <div id="app-bg">
    <!-- <canvas class="glsl-canvas" data-fragment-url="space.glsl" width="100" height="100"></canvas> -->
  </div>
  <Grid :items=items :isActive=true :parentGridIsActive=true :isMain=true />

  <iframe src="https://widget.0xecho.com?color-theme=dark&desc=&has-h-padding=true&has-v-padding=true&modules=comment%2Clike%2Ctip&receiver=0x869Cc837A999c3cE0AF1b02C2C2ca444ecC8aB74&target_uri=https%3A%2F%2Fmaha.love" frameborder="0"></iframe>
</template>

<script>
import Grid from '@/components/Grid.vue'
import { renderQueue } from '@/RenderQueue.js'
const TWEEN = require('@tweenjs/tween.js')
import { Canvas } from 'glsl-canvas-js';

export default {
  name: 'App',
  components: { Grid },
  data() {
    return {
      items: window.treeData.children
    }
  },
  setup(){
    let first = { name: 'mich', children: [], title: true };
    let second = { name: 'ael\u0020pa', children: [], title: true };
    let third = { name: 'risi', children: [], title: true };
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
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Poppins:wght@100&display=swap');

html, body {
  background-color: black;
  color: white;
  font-size: 2vw;
  text-transform: uppercase;
  font-family: 'Fredoka One', cursive;
  font-family: 'Poppins', sans-serif;
  /* cursor: none; */
  /* background-image: url(/images/bg.png); */
  /* background: -webkit-radial-gradient(circle, #2C5364, #203A43, #0F2027);
  background: radial-gradient(circle, #2C5364, #203A43, #0F2027); */
  /* background: url('~@/assets/bg.webp') 100% 100%; */
}

iframe {
  cursor: pointer;
}

#app {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}

#app-bg {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 0;
}

#app-bg canvas {
  width: 10%;
  height: 10%;
  transform-origin: top left;
  transform: scale(10);
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
