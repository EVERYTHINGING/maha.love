/* eslint-disable */
import { ComputeMatrix } from '@/computeMatrix.js'

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