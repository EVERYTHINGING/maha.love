<template>
  <div class="grid" :class="{ 'active': isActive, 'has-selected-item': selectedItem != null }">
    <div ref="viewport" class="viewport">
      <div class="items-wrapper">
        <div ref="items" class="items" :style="'width:'+width+'px;'+'height:'+height+'px;'">
          <template v-for="(item, index) in items" :key=index>
            <Item ref="item" :item=item v-on:selected="handleSelectedItem" :isSelectable=isActive />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMouse } from '@vueuse/core'
import { Helpers } from '@/helpers.js'
import { renderQueue } from '@/RenderQueue.js'
const TWEEN = require('@tweenjs/tween.js')

export default {
  name: 'Grid',
  components: {},
  beforeCreate() {
    //needed to fix circular referencing
    this.$options.components.Item = require('@/components/Item.vue').default
  },
  props: {
    items: Array,
    isActive: Boolean
  },
  data(){
    return {
      width: 0,
      height: 0,
      selectedItem: null
    }
  },
  methods: {
    handleSelectedItem(item){
      this.selectedItem = item.isSelected ? item : null;

      if(item.isSelected){
        var tweenDelayMax = 200;
        var tweenSpeed = 500;

        var offsetX = 50;
        var offsetY = 50;

        var gridOffsetX = (this.$refs.items.offsetLeft)*-1;
        var gridOffsetY = (this.$refs.viewport.scrollTop - this.$refs.items.offsetTop);

        var tl = { 
          x: gridOffsetX + offsetX,
          y: gridOffsetY + offsetY
        };

        var tr = { 
          x: (gridOffsetX + this.$refs.viewport.clientWidth) - offsetX,
          y: gridOffsetY + offsetY
        };

        var bl = { 
          x: gridOffsetX + offsetX,
          y: gridOffsetY + (this.$refs.viewport.clientHeight - offsetY)
        };

        var br = { 
          x: (gridOffsetX + this.$refs.viewport.clientWidth) - offsetX,
          y: gridOffsetY + (this.$refs.viewport.clientHeight - offsetY)
        };

        var rand1 = Math.abs((Math.random()*tweenDelayMax)-(tweenDelayMax/2));
        var rand2 = Math.abs((Math.random()*tweenDelayMax)-(tweenDelayMax/2));
        var rand3 = Math.abs((Math.random()*tweenDelayMax)-(tweenDelayMax/2));
        var rand4 = Math.abs((Math.random()*tweenDelayMax)-(tweenDelayMax/2));

        var maxDelay = Math.max(rand1, rand2, rand3, rand4);

        var tweenTL = new TWEEN.Tween(this.selectedItem.points.tl)
                    .to({ x: tl.x, y: tl.y }, tweenSpeed)
                    .delay(rand1)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
        var tweenTR = new TWEEN.Tween(this.selectedItem.points.tr)
                    .to({ x: tr.x, y: tr.y }, tweenSpeed)
                    .delay(rand2)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
        var tweenBR = new TWEEN.Tween(this.selectedItem.points.bl)
                    .to({ x: bl.x, y: bl.y }, tweenSpeed)
                    .delay(rand3)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
        var tweenBL = new TWEEN.Tween(this.selectedItem.points.br)
                    .to({ x: br.x, y: br.y }, tweenSpeed)
                    .delay(rand4)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
        
        setTimeout(function(){
          tweenTL.stop();
          tweenTR.stop();
          tweenBR.stop();
          tweenBL.stop();
        }, tweenSpeed+maxDelay+100);
      }
    },

    loop() {
      let i, j, p, item, distanceX, distanceY, prox, centerX, centerY, angle;
      let maxProx = 400;
      let speed = -100;
      let speedMulti = 1;
      /*
      let fullOffset = Helpers.getAbsolutePosition(this.$refs.items);
      let mouseX = this.mouse.x.value - fullOffset.x;
      let mouseY = this.mouse.y.value - fullOffset.y;
      */
      let mouseX = this.mouse.x.value - this.$refs.items.offsetLeft;
      let mouseY = this.mouse.y.value + this.$refs.viewport.scrollTop - this.$refs.items.offsetTop;

      if(Helpers.isMobile){
        mouseX = (this.$refs.viewport.clientWidth/2)  - this.$refs.items.offsetLeft;
        mouseY = (this.$refs.viewport.clientHeight/2)+ this.$refs.viewport.scrollTop - this.$refs.items.offsetTop;
      }

      let numPoints = this.points.length;

      for(i = 0; i < numPoints; i++){
          p = this.points[i];

          if(this.selectedItem == null){
            distanceX = p.x - mouseX;
            distanceY = p.y - mouseY;
            prox = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            p.x = (p.x - (distanceX/prox)*(maxProx/prox)*speed*speedMulti) - ((p.x - p.origX)/2);
            p.y = (p.y - (distanceY/prox)*(maxProx/prox)*speed*speedMulti) - ((p.y - p.origY)/2);

          }else if(p != this.selectedItem.points.tl && p != this.selectedItem.points.tr && p != this.selectedItem.points.br && p != this.selectedItem.points.bl){
            centerX = (this.selectedItem.points.tl.origX + (this.selectedItem.points.tr.origX-this.selectedItem.points.tl.origX));
            centerY = (this.selectedItem.points.tl.origY + (this.selectedItem.points.bl.origY-this.selectedItem.points.tl.origY));
            distanceX = p.origX - centerX;
            distanceY = p.origY - centerY;
            prox = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            angle = Math.atan2(distanceY, distanceX);

            p.x = (p.origX + Math.cos(angle)*(prox*this.$refs.viewport.clientWidth));
            p.y = (p.origY + Math.sin(angle)*(prox*this.$refs.viewport.clientHeight));
          }
      }

      //update tween
      TWEEN.update();
      
      //draw items
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
    if(Helpers.isMobile){ numItemsX = 1; }
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
    this.selectedItem = null;
    
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
    
    renderQueue.add(this.loop);
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

.grid.has-selected-item > .viewport {
  overflow-y: hidden;
}

.items-wrapper {
  margin-top: 30vh;
  margin-bottom: 30vh;
}

.items {
	transform-style: preserve-3d;
	position: relative;
	margin: 0 auto;
  /* opacity: 0.5; */
  /* transition: opacity 0.1s ease-in-out; */
}

.items:hover {
  /* opacity: 1; */
}

/* .grid.has-selected-item .items:first-child {
  transform-style: flat;
} */
</style>
