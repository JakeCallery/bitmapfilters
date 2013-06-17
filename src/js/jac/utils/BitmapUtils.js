/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){

	    var BitmapUtils = {};

	    /**
	     * Creates an Image element from a canvas element.
	     * @param {canvas} $canvasEl
	     * @returns {Image} a dom <img> element
	     */
	    BitmapUtils.imgFromCanvas = function($canvasEl){
			var img = new Image();
		    img.src = $canvasEl.toDataURL('image/png');
		    return img;
	    };

	    /**
	     * Gets an ImageData object from $img
	     * @param {Image} $img
	     * @param {Document} [$document]
	     * @returns {ImageData}
	     */
	    BitmapUtils.imageDataFromImg = function($img, $document){
			$document = $document || document;
		    var canvas = $document.createElement('canvas');
		    canvas.width = $img.width;
		    canvas.height = $img.height;
		    var ctx = canvas.getContext('2d');
		    ctx.drawImage($img,0,0);
		    return ctx.getImageData(0,0,canvas.width, canvas.height);
	    };

        //Return constructor
        return BitmapUtils;
    })();
});
