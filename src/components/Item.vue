<template>
  
  <div @click="handleClick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" class="item" :class="{ selected: isSelected, 'has-grid': item.children != null, 'is-title': item.children != null && item.children.length === 0 }" :style="itemStyle">
    <div class="gradient-bg" v-if="!item.children" :style="gradientStyle"></div>
    <template v-if="item.children">
      <div v-if="isSelected && hasIndex" class="close-btn" @click.stop="$emit('deselected', this)">×</div>
      <div class="name">
        <div class="name-inner">
          <span v-for="(char, index) in item.name" :key=index>{{ char }}</span>
        </div>
      </div>
      <Grid ref="grid" :items="item.children" :isActive="isSelected" :parentGridIsActive="parentGridIsActive" />
    </template>
    <template v-else>
      <div v-if="item.index">
        <div v-if="isSelected" class="close-btn" @click.stop="$emit('deselected', this)">×</div>
        <div v-if="!isSelected" class="media-preview">
          <div v-if="!isSelected && displayName" class="media-hover-name" :class="{ visible: isHovered }">
            <div class="media-hover-name__inner">
              <span v-for="(char, index) in displayChars" :key="index">{{ char }}</span>
            </div>
          </div>
        </div>
        <div v-if="isSelected" class="embedded-app" @click="onCarouselClick">
          <iframe :src="indexSrc" frameborder="0"></iframe>
        </div>
      </div>
      <div v-else-if="hasMedia">
        <div v-if="!isSelected" class="media-preview">
          <video v-if="isVideoPath(firstMedia)" :src="firstMedia" autoplay muted loop playsinline></video>
          <img v-else :src="firstMedia" />
        </div>
        <div v-if="!isSelected && displayName" class="media-hover-name" :class="{ visible: isHovered }">
          <div class="media-hover-name__inner">
            <span v-for="(char, index) in displayChars" :key="index">{{ char }}</span>
          </div>
        </div>
        <div v-if="isSelected" class="media-selected" @click="onCarouselClick">
      <transition name="carousel-mask" @after-enter="onCarouselAfterEnter">
          <div v-if="showCarousel" class="media-carousel">
            <Carousel :key="carouselKey" ref="carousel" :items-to-show="1" :wrap-around="true">
              <Slide v-for="(src, mIndex) in item.media" :key="mIndex">
                <video v-if="isVideoPath(src)" :src="src" controls playsinline preload="metadata"></video>
                <img v-else :src="src" />
              </Slide>
              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </Carousel>
          </div>
        </transition>
          <transition name="caption-slide-fade">
            <div v-if="item.description && isSelected && showCaption" class="media-caption" @click.stop>
              <div v-if="item.name" class="media-caption__name">{{ item.name }}</div>
              <div v-if="item.title" class="media-caption__title">{{ item.title }}</div>
              <div class="media-caption__description">{{ item.description }}</div>
            </div>
          </transition>
        </div>
      </div>
      <template v-else>
        <video v-if="isVideo && hasSrc" :key="item.path" :src="item.path" autoplay muted loop playsinline></video>
        <img v-else-if="hasSrc" :src="item.path" />
      </template>
    </template>
  </div>
</template>

<script>
import Grid from '@/components/Grid.vue'
import { Helpers } from '@/helpers.js'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'

export default {
  name: 'Item',
  components: { Grid, Carousel, Slide, Navigation, Pagination },
  emits: ['selected', 'deselected'],
  props: {
    item: Object,
    index: Number,
    numSiblings: Number,
    parentGridIsActive: Boolean
  },
  watch: {
    isSelected(newVal){
      if(newVal){
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        });
      }
    }
  },
  data(){
    return {
      isSelected: false,
      isHovered: false,
      carouselVersion: 0,
      showCarousel: false,
      showCaption: false,
      carouselDelayTimer: null
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
    },
    isVideo() {
      return this.item && this.item.path && /\.mp4$/i.test(this.item.path);
    },
    hasSrc() {
      return !!(this.item && this.item.path);
    },
    hasMedia() {
      return !!(this.item && this.item.media && this.item.media.length > 0);
    },
    firstMedia(){
      return this.hasMedia ? this.item.media[0] : null;
    },
    displayName(){
      return (this.item && (this.item.name || this.item.title)) ? (this.item.name || this.item.title) : '';
    },
    displayChars(){
      return this.displayName ? this.displayName.split('') : [];
    },
    hasIndex(){
      return !!(this.item && this.item.index);
    },
    indexSrc(){
      if(!this.item || !this.item.path){ return null; }
      const indexName = this.item.index || 'index.html';
      return `${this.item.path}${indexName}`;
    },
    carouselKey(){
      const nameOrIndex = (this.item && (this.item.name || this.item.title)) ? (this.item.name || this.item.title) : this.index;
      const mediaLen = (this.item && this.item.media) ? this.item.media.length : 0;
      return `${nameOrIndex}-${this.carouselVersion}-${mediaLen}`;
    }
  },
  methods: {
      onMouseEnter(){ this.isHovered = true; },
      onMouseLeave(){ this.isHovered = false; },
      onCarouselClick(event){
        const target = event.target;
        if(target && (target.closest('.carousel__prev') || target.closest('.carousel__next') || target.closest('.carousel__pagination') || target.closest('.carousel__pagination-button'))){
          event.stopPropagation();
        }
      },
      isVideoPath(src){
        return /\.(mp4|webm|ogg|mov)$/i.test(src || '');
      },
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
        this.showCarousel = false;
        this.showCaption = false;
        if(this.carouselDelayTimer){
          clearTimeout(this.carouselDelayTimer);
          this.carouselDelayTimer = null;
        }
      },
      setPoints(points){
          this.points = points;
      },
      draw(){
        const p = this.points;
        if(!p || !p.tl || !p.tr || !p.bl || !p.br){ return; }
        if(!p.tl.isAtOrigin() || !p.tr.isAtOrigin() || !p.bl.isAtOrigin() || !p.br.isAtOrigin()){
          Helpers.ComputeMatrix.transform2d(this.$el, 
                    p.tl.x,
                    p.tl.y,
                    p.tr.x,
                    p.tr.y,
                    p.bl.x,
                    p.bl.y,
                    p.br.x,
                    p.br.y,
                    0);
        }
      },
      onCarouselAfterEnter(){
        this.showCaption = true;
        this.bumpCarouselVersion();
      },
      startCarouselTransition(){
        // Show carousel first; caption will animate after @after-enter
        this.showCaption = false;
        if(this.carouselDelayTimer){ clearTimeout(this.carouselDelayTimer); this.carouselDelayTimer = null; }
        this.showCarousel = true;
      },
      bumpCarouselVersion(){
        this.carouselVersion++;
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
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

video {
	display: block;
	height: 100%;
	max-height: 100%;
	margin: 0 auto;
  position: relative;
  z-index: 1;
}

.media-carousel {
	position: relative;
	width: 100%;
	height: 65vh;
}
.embedded-app {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.embedded-app iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.carousel-mask-enter-active,
.carousel-mask-leave-active {
	transition: opacity 250ms ease, clip-path 500ms ease;
}
.carousel-mask-enter-from,
.carousel-mask-leave-to {
	opacity: 0;
	clip-path: inset(0 0 100% 0 round 0);
}
.carousel-mask-enter-to,
.carousel-mask-leave-from {
	opacity: 1;
	clip-path: inset(0 0 0 0 round 0);
}

.media-carousel ::v-deep(.carousel) {
	height: 100%;
	--vc-pgn-border-radius: 50%;
	--vc-pgn-width: 8px;
	--vc-pgn-height: 8px;
	--vc-pgn-gap: 8px;
}
.media-carousel ::v-deep(.carousel__viewport) {
	height: 100%;
}
.media-carousel ::v-deep(.carousel__track) {
	height: 100%;
}
.media-carousel ::v-deep(.carousel__slide) {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Ensure media fills slide width while fitting within height */
.media-carousel img,
.media-carousel video {
	width: 100% !important;
	height: 100% !important;
	object-fit: contain;
}

.media-preview {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
.media-preview img,
.media-preview video {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.media-hover-name {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0,0,0,0.55);
	backdrop-filter: blur(2px);
	text-align: center;
	opacity: 0;
	transition: opacity 160ms ease-in-out;
	pointer-events: none;
	z-index: 2;
	overflow: hidden; /* prevent text from extending past item */
}
.media-hover-name.visible {
	opacity: 1;
}

.media-hover-name__inner {
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	font-weight: bold;
	font-size: clamp(1.25rem, 7vw, 0.5em);
	letter-spacing: 0;
	line-height: 1em;
	transform: translateY(1em);
	transition: transform 200ms ease-out;
	flex-wrap: nowrap;
	overflow: hidden;
}
.media-hover-name.visible .media-hover-name__inner {
	transform: translateY(0);
}

.media-caption {
  color: black;
	padding: 16px;
	backdrop-filter: blur(2px);
	font-size: 1.5em;
	line-height: 1.4;
}
.caption-slide-fade-enter-active,
.caption-slide-fade-leave-active {
	transition: opacity 300ms ease 100ms, transform 300ms ease 100ms;
}
.caption-slide-fade-enter-from,
.caption-slide-fade-leave-to {
	opacity: 0;
	transform: translateY(1.4em);
}
.caption-slide-fade-enter-to,
.caption-slide-fade-leave-from {
	opacity: 1;
	transform: translateY(0);
}

/* Stagger inner caption lines (title then description) */
.media-caption__title,
.media-caption__description {
	transition: opacity 500ms ease, transform 500ms ease;
}
.caption-slide-fade-enter-from .media-caption__title,
.caption-slide-fade-enter-from .media-caption__description {
	opacity: 0;
	transform: translateY(1.4em);
}
.caption-slide-fade-enter-to .media-caption__title {
	opacity: 1;
	transform: translateY(0);
	transition-delay: 200ms;
}
.caption-slide-fade-enter-to .media-caption__description {
	opacity: 1;
	transform: translateY(0);
	transition-delay: 400ms;
}
.media-caption__name {
	font-weight: bold;
  letter-spacing: 0.5em;
}
.media-caption__title {
	opacity: 0.85;
}
.media-caption__description {
	margin-top: 8px;
	text-transform: none;
  font-size: 0.5em;
}

/* Fallback to ensure pagination are dots */
.media-carousel ::v-deep(.carousel__pagination-button) {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.name {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  font-size: 5em;
  letter-spacing: 0;
  z-index: 0;
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
