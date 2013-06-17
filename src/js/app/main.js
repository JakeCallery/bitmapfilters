/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 6/14/13
 * Time: 2:00 PM
 * To change this template use File | Settings | File Templates.
 */
define([
'jac/logger/Logger',
'jac/logger/ConsoleTarget',
'jac/utils/BitmapUtils',
'jac/bitmap/GreyscaleFilter',
'jac/utils/EventUtils',
'jac/bitmap/ThresholdFilter'
],
function(L,ConsoleTarget,BitmapUtils,GreyscaleFilter,EventUtils,ThresholdFilter){
	L.addLogTarget(new ConsoleTarget());
	L.log('New Main!');

	/**@type {Image}*/var sourceImg = document.getElementById('sourceImg');

	L.log('Image Complete: ' + sourceImg.complete);

	var handleImageLoaded = function(){
		L.log('handleImageLoaded');

		var sourceCanvas = document.getElementById('sourceCanvas');
		var sourceCtx = sourceCanvas.getContext('2d');

		var sourceImgData = BitmapUtils.imageDataFromImg(sourceImg);
		sourceCtx.putImageData(sourceImgData,0,0);

		//Or you could do the initial draw directly from the image, like this
		//sourceCtx.drawImage(sourceImg,0,0);

		var destCanvas = document.getElementById('destinationCanvas');
		var destCtx = destCanvas.getContext('2d');

		var srcImageData = sourceCtx.getImageData(0,0,300,300);
		var destImageData = destCtx.getImageData(0,0,300,300);
		//GreyscaleFilter.filter(srcImageData.data,destImageData.data);
		ThresholdFilter.filter(srcImageData.data,destImageData.data,'>=', 0x000000AA, 0xFF00FFFF,0x000000FF, false);
		destCtx.putImageData(destImageData,0,0);

	};

	if(sourceImg.complete === true){
		handleImageLoaded();
	} else {
		EventUtils.addDomListener(sourceImg,'load',handleImageLoaded);
	}



});
