<template>
  <div @click="handleClick" class="item" :class="{ selected: isSelected, 'has-grid': item.children != null ? true : false }" :style="'background-color:'+bgColor+');'">
    <template v-if="item.children">
      <Grid :items="item.children" :isActive="isSelected" />
    </template>
    <template v-else>
      <img :src="item.image" />
    </template>
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue'
import { Helpers } from '@/helpers.js'

export default {
  name: 'Item',
  components: { Grid },
  emits: ['selected', 'deselected'],
  props: {
    item: Object,
    parentGridIsActive: Boolean
  },
  data(){
    return {
      isSelected: false
    }
  },
  methods: {
      handleClick(event){
        if(this.parentGridIsActive){ //is selectable because parent grid is actively open
          event.stopPropagation();
          if(!this.isSelected){
            this.$emit('selected', this);
          }else{
            this.$emit('deselected', this);
          }
        }
      },
      select(){
        this.isSelected = true;
      },
      deselect(){
        this.isSelected = false;
      },
      setPoints(points){
          this.points = points;
      },
      draw(){
        if(!this.points.tl.isAtOrigin() || !this.points.tr.isAtOrigin() || !this.points.bl.isAtOrigin() || !this.points.br.isAtOrigin()){
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
  width: 30vw;
  height: 30vh;
	margin: 0;
	overflow: hidden;
	cursor: pointer;
	-webkit-perspective: 500;
	-moz-perspective: 500;
	-o-perspective: 500;
	-ms-perspective: 500;
	perspective: 500;
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

.item.selected.has-grid {
  cursor: w-resize;
}

.item.has-grid,
.item.selected {
  width: 100vw;
  height: 100vh;
}

.item.selected img {
  image-rendering: auto;
}

img {
	display: block;
	height: auto;
	max-height: 100%;
	margin: 0 auto;
  image-rendering: crisp-edges;
}
</style>
