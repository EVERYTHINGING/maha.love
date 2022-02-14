//////TODO: use points as prop?

<template>
  <div @click="handleClick" class="item" :class="{ selected: isSelected }" :style="'background-color:'+bgColor+');'">
    <!-- <div v-if="item.name" class="name">{{ item.name }}</div> -->
    <Grid v-if="item.children" :items="item.children" :isActive="isSelected" />
    <img v-else :src="item.image" />
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue'
import { Helpers } from '@/helpers.js'

export default {
  name: 'Item',
  components: { Grid },
  emits: ['selected'],
  props: {
    item: Object,
    isSelectable: Boolean
  },
  data(){
    return {
      isSelected: false
    }
  },
  methods: {
      handleClick(event){
        if(this.isSelectable){
          event.stopPropagation();
          this.isSelected = !this.isSelected;
          this.$emit('selected', this);
        }
      },
      setPoints(points){
          this.points = points;
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
  width: 90vw;
  height: 90vh;
	margin: 0;
	overflow: hidden;
	cursor: pointer;
	-webkit-perspective: 500;
	-moz-perspective: 500;
	-o-perspective: 500;
	-ms-perspective: 500;
	/* perspective: 500; */
	-webkit-transform-origin: left top;
	-moz-transform-origin: left top;
	-o-transform-origin: left top;
	-ms-transform-origin: left top;
	transform-origin: left top;

	display: flex;
  justify-content: center;
  align-items: center;
}

.item:hover {
	z-index: 9999;	
}

.item.selected {

}

img {
	display: block;
	height: auto;
	max-width: 100%;
	/* margin: 0 auto; */
}
</style>
