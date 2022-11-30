/* eslint-disable */
import { ComputeMatrix } from '@/computeMatrix.js'
import { queue } from 'async';

export let Helpers = {};

Helpers.getVendorTransform = function() {

 var vendorTransform = "transform";

  var property = "transform",
      prefixes = ['-moz-', '', '-ms-', '-webkit-', '-o-'];

  for (var i = 0; i < prefixes.length; i++) {
    if (typeof document.body.style[prefixes[i] + property] !== 'undefined') {

      vendorTransform = prefixes[i] + property;

      return vendorTransform;
    }
  }

  return vendorTransform;
}

Helpers.VendorTransform = Helpers.getVendorTransform();

//Compute Matrix

Helpers.ComputeMatrix = new ComputeMatrix(Helpers.VendorTransform);

//Is Mobile?
Helpers.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

//IOS?

Helpers.isIOS = (navigator.platform == "iPad" || navigator.platform == "iPhone" || navigator.platform == "iPod" || navigator.platform == "iPhone Simulator" || navigator.platform == "iPad Simulator");

//Point

Helpers.Point = function(x, y){
	this.x = x || 0;
	this.y = y || 0;
	this.origX = x;
	this.origY = y;

	this.copy = function(){
		return new Helpers.Point(this.x, this.y);
	};

	this.equals = function(p){
 		return (this.x === p.x && this.y === p.y);
 	};

    this.isAtOrigin = function(){
        return (this.x === this.origX && this.y === this.origY);
    };
}


Helpers.getAbsolutePosition = function(elm) {
    var xPos = 0, yPos = 0;

    while(elm) {
        xPos += (elm.offsetLeft - elm.scrollLeft + elm.clientLeft);
        yPos += (elm.offsetTop - elm.scrollTop + elm.clientTop);
        elm = elm.offsetParent;
    }

    return { x: xPos, y: yPos };
}

Helpers.RenderQueue = function(){
    this.queue = [];

    let i = 0;
    let loop = function(){
        for(i = 0; i < queue.length; i++){
            console.log(queue[i]);
            queue[i]();
        }
        window.requestAnimationFrame(loop);
    }

    this.start = function(){
        loop();
    }

    this.add = function(fn){
        this.queue.push(fn);
    }
}

Helpers.sleep = function(milliseconds){
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}