///////TODO performance enhancements

<template>
  <div class="grid">
    <div ref="viewport" class="viewport" @scroll="handleScroll">
      <div class="items-wrapper">
        <div ref="items" class="items" :style="'width:'+width+'px;'+'height:'+height+'px;'">
          <template v-for="(item, index) in items" :key=index>
            <Item ref="item" :item=item />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMouse, useRafFn } from '@vueuse/core'
import { Helpers } from '@/helpers.js'

export default {
  name: 'Grid',
  components: {},
  beforeCreate() {
    //needed to fix circular referencing
    this.$options.components.Item = require('@/components/Item.vue').default
  },
  props: {
    items: Array
  },
  data(){
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    handleScroll() {

    },
    updatePoints() {
      let i, j, p, item, distanceX, distanceY, prox;
      let maxProx = 800;
      let speed = -100;
      let speedMulti = 1;
      /*
      let fullOffset = Helpers.getAbsolutePosition(this.$refs.items);
      let mouseX = this.mouse.x.value - fullOffset.x;
      let mouseY = this.mouse.y.value - fullOffset.y;
      */
      let mouseX = this.mouse.x.value - this.$refs.items.offsetLeft;
      let mouseY = this.mouse.y.value + this.$refs.viewport.scrollTop - this.$refs.items.offsetTop;

      for(i = 0; i < this.points.length; i++){
          p = this.points[i];
          distanceX = p.x - mouseX;
          distanceY = p.y - mouseY;
          prox = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          p.x = (p.x - (distanceX/prox)*(maxProx/prox)*speed*speedMulti) - ((p.x - p.origX)/2);
          p.y = (p.y - (distanceY/prox)*(maxProx/prox)*speed*speedMulti) - ((p.y - p.origY)/2);	
      }

      
      if(this.$refs.item){
        for(j = 0; j < this.$refs.item.length; j++){
          item = this.$refs.item[j];
          item.draw();
        }	
      }	
    }

  },
  mounted() {
    this.points = [];
    let numItems = this.items.length;
    let numItemsX = 3;
    let itemWidthPercentage = 20;
    let itemHeightPercentage = 30;
    let maxOffset = 20;
    let itemWidth = Math.round(this.$refs.viewport.clientWidth*(itemWidthPercentage/100));
    let itemHeight = Math.round(this.$refs.viewport.clientHeight*(itemHeightPercentage/100));
    let numItemsY = Math.ceil(numItems/numItemsX);
    let pointsArrayXY = [];
    let i = 0;
    let y, x, point;
    this.mouse = useMouse();
    this.width = numItemsX*itemWidth;
    this.height = numItemsY*itemHeight;
    
    for(y = 0; y < numItemsY+1; y++){				
      pointsArrayXY[y] = [];
      
      for(x = 0; x < numItemsX+1; x++){
        let offsetX = (Math.random()*(maxOffset*2))-maxOffset;
        let offsetY = (Math.random()*(maxOffset*2))-maxOffset;

        point = new Helpers.Point((x*itemWidth)+offsetX, (y*itemHeight)+offsetY);
        pointsArrayXY[y][x] = point;
        this.points.push(point);

        if(x > 0 && y > 0 && i < numItems && this.$refs.item instanceof Array){
          let item = this.$refs.item[i];

          let itemPoints = { tl: pointsArrayXY[y-1][x-1], 
                              tr: pointsArrayXY[y-1][x], 
                              bl: pointsArrayXY[y][x-1], 
                              br: pointsArrayXY[y][x] 
                          };

          item.setPoints(itemPoints);
          i++;
        }
      }
    }
    
    useRafFn(this.updatePoints);
  }
}
</script>

<style scoped>
.grid {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	overflow-y: hidden;
}

.viewport {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	overflow-y: scroll;
}

.viewport.active {
	border: solid 1px yellow;
	overflow-y: scroll;
}

.items-wrapper {
  margin-top: 300px;
  margin-bottom: 300px;
}

.items {
	transform-style: preserve-3d;
	position: relative;
	margin: 0 auto;
}
</style>
