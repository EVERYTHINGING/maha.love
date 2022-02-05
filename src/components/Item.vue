<template>
  <div @click="handleClick" class="item" :class="{ selected: isSelected }" :style="'background-color:'+bgColor+');'">
    <div v-if="item.name" class="name">{{ item.name }}</div>
    <Grid v-if="item.children" :items="item.children" />
    <img v-else :src="item.image" />
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue'
import { Helpers } from '@/helpers.js'

export default {
  name: 'Item',
  components: { Grid },
  props: {
    item: Object
  },
  data(){
    return {
      isSelected: false
    }
  },
  methods: {
      handleClick(){
        this.isSelected = !this.isSelected;
        console.log('click');
      },
      setPoints(points){
          this.points = points;
          console.log(this.points);
      },
      draw(){
          Helpers.ComputeMatrix.transform2d(this.$el, 
                    this.points.tl.x,
                    this.points.tl.y,
                    this.points.tr.x,
                    this.points.tr.y,
                    this.points.bl.x,
                    this.points.bl.y,
                    this.points.br.x,
                    this.points.br.y,
                    0);
      }
  },
  setup() {
      const bgColor = 'rgb('+Math.random()*255+', '+Math.random()*255+', '+Math.random()*255+');'
      return { bgColor }
  },
  mounted(){

  },
}
</script>

<style scoped>
.item {
	position: absolute;
	top: 0px;
	left: 0px;
	margin: 0;
	overflow: hidden;
	cursor: pointer;
	perspective: 500;
	transform-origin: left top;

	display: flex;
  justify-content: center;
  align-items: center;
}

.item:hover {
	z-index: 9999;	
}

.item.selected {
  border: solid 3px yellow;
}

img {
	display: block;
	max-width: 100%;
	max-height: 100%;
	margin: 0 auto;
}
</style>
