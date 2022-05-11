<template>
  <div @click="handleClick" class="item" :class="{ selected: isSelected, 'has-grid': item.children != null, 'is-title': item.children != null && item.children.length === 0 }" :style="'background-color:'+bgColor+';'">
    <template v-if="item.children">
      <!-- <div class="close-btn">x</div> -->
      <div class="name">
        <div class="name-inner">
          <span v-for="(char, index) in item.name" :key=index>{{ char }}</span>
        </div>
      </div>
      <Grid :items="item.children" :isActive="isSelected" :parentGridIsActive="parentGridIsActive" />
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
      if(props.item.children != null){ bgColor = `hsl(${hue}, 30%, 60%)`; }
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
	cursor: url("~@/assets/icons/tap.png"), pointer;
  /* cursor: pointer; */
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

.item.selected {
  cursor: w-resize;
  /* background-color: transparent !important; */
}

.item.is-title {
  background-color: transparent !important;
  cursor: auto;
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

.name {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  font-size: 5em;
  letter-spacing: 0;
}

.name-inner {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-style: bold;
  /* background: linear-gradient(#eee, #333);
  background-clip: text;
  -webkit-text-fill-color: transparent; */
}

.item.is-title > .name {
  height: 100%;
  font-size: 5em;
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
}
</style>
