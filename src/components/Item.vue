<template>
  
  <div @click="handleClick" class="item" :class="{ selected: isSelected, 'has-grid': item.children != null, 'is-title': item.children != null && item.children.length === 0 }" :style="itemStyle">
    <div class="gradient-bg" v-if="!item.children" :style="gradientStyle"></div>
    <template v-if="item.children">
      <!-- <div class="close-btn">x</div> -->
      <div class="name">
        <div class="name-inner">
          <span v-for="(char, index) in item.name" :key=index>{{ char }}</span>
        </div>
      </div>
      <Grid ref="grid" :items="item.children" :isActive="isSelected" :parentGridIsActive="parentGridIsActive" />
    </template>
    <template v-else>
      <img v-if="item.path" :src="item.path" />
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
    index: Number,
    numSiblings: Number,
    parentGridIsActive: Boolean
  },
  data(){
    return {
      isSelected: false
    }
  },
  computed: {
    itemStyle() {
      // Only set background for items without children, otherwise use transparent
      if (this.item.children != null) {
        return 'background-color: transparent;';
      } else {
        // For items with children, we'll use the animated gradient in CSS
        return `background-color: ${this.bgColor};`;
      }
    },
    gradientStyle() {
      // Generate a random animation delay between 0s and the total animation duration
      // We use the item index to ensure the delay is consistent across renders
      const randomDelay = (this.index * -8) % 40; // -8s per index, modulo 40s (animation duration)
      return `animation-delay: ${randomDelay}s;`;
    }
  },
  methods: {
      handleClick(event){
        if(this.parentGridIsActive && !this.item.title){ //is selectable because parent grid is actively open
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
  setup(props) {
      console.log(props.numSiblings);
      let hue = Math.floor(360/props.numSiblings)*props.index;
      let bgColor = `hsl(${hue}, 70%, 80%)`;
      if(props.item.children != null){ bgColor = `transparent`; }
      return { bgColor }
  },
  mounted(){
  }
}
</script>

<style scoped>
.item {
	position: absolute;
	top: 0px;
	left: 0px;
  width: 20vw;
  height: 20vh;
	margin: 0;
	overflow: hidden;
	cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC), pointer;
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
  isolation: isolate; /* Create a new stacking context for z-index */
}

/* Animated gradient background */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: 400% 400%;
  animation: gradient-animation 40s ease infinite;
  background-image: linear-gradient(
    45deg,
    #CBE4F9,
    #CDF5F6,
    rgba(239, 249, 218, 0),  /* EFF9DA with transparency */
    #F9EBDF,
    transparent,            /* Fully transparent color */
    #F9D8D6,
    #D6CDEA,
    rgba(239, 225, 204, 0),  /* EFE1CC with transparency */
    #EBDAC4,
    #E6D3BA
  );
  opacity: 0.92;
  mix-blend-mode: normal;
}

/* Gradient animation */
@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.item:hover {
	z-index: 9999;	
}

.item.selected {
  	cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAANtJREFUWEflluEOhCAMg+X9HxqjEQPNgA4dw3g/7zj2tXSDsDl/gnP97QlABPihvYb+dBV2AzgLx1jWD+HWohKlWpwrXw4g5SFz4v6qFfTXHJgJkGqJWUC1vWyMOGAGgG2lmlEYStaJ3AE3AOosVXY0FmOXHA78CwDbdboDEkDRVuxZN0axuEVt/XAXWADUxJuENHUDMwm/ASDcgoWjTAYeHYE5ANL1Zn9NDd6OdAbcAXqKzY/AE0CclD2gxnug+InJwFoArHL2dax2wBNAe2tS4qhFECj27UjtvQNkKX4TTbCuewAAAABJRU5ErkJggg==), pointer;
}

.item.is-title {
  background-color: transparent !important;
  cursor: none;
}

.item.has-grid,
.item.selected {
  width: 100vw;
  height: 100vh;
}

.item.selected img {
  image-rendering: auto;
}

.item.selected .gradient-bg {
  animation: gradient-animation 60s ease infinite; /* Slower animation when selected */
  background-size: 300% 300%; /* Larger pattern when selected */
}

img {
	display: block;
	height: 100%;
	max-height: 100%;
	margin: 0 auto;
  image-rendering: crisp-edges;
  position: relative;
  z-index: 1;
}

.name {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  font-size: 5em;
  letter-spacing: 0;
  z-index: 1;
}

.name-inner {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-style: bold;
}

.item.is-title > .name {
  height: 100%;
  font-size: 10vw;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item.selected > .close-btn {
  display: block;
}

.close-btn {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 2em;
  z-index: 1;
}
</style>
