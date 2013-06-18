// Convolution Matrix Demo 
//
// See the drawDest() function for the guts of the thing.
//
// Dependencies: jQuery 1.7+ (uses .on and .off methods)
//
// --------------------------------------------------------------------
// Copyright (c) 2012 Brian "Beej Jorgensen" Hall <beej@beej.us>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// --------------------------------------------------------------------

(function() {

var images = {
	"bell": { "url": "images/conv_bell.jpg" },
	"bridge": { "url": "images/conv_bridge.jpg" },
	"building": { "url": "images/conv_building.jpg" },
	"depot": { "url": "images/conv_depot.jpg" },
	"house": { "url": "images/conv_house.jpg" },
	"lena": { "url": "images/conv_lena.jpg" }
};

var conv = {
	"blur": [
		[ 1.000, 1.000, 1.000 ],
		[ 1.000, 1.000, 1.000 ],
		[ 1.000, 1.000, 1.000 ]
	],
	"sharpen": [
		[ 0.000, -3.00, 0.000 ],
		[ -3.00, 21.00, -3.00 ],
		[ 0.000, -3.00, 0.000 ]
	],
	"emboss": [
		[ -18.0, -9.00, 0.000 ],
		[ -9.00,  9.00,  9.00 ],
		[ 0.000,  9.00, 18.00 ]
	],
	"lighten": [
		[ 0.000, 0.000, 0.000 ],
		[ 0.000, 12.00, 0.000 ],
		[ 0.000, 0.000, 0.000 ]
	],
	"darken": [
		[ 0.000, 0.000, 0.000 ],
		[ 0.000, 6.000, 0.000 ],
		[ 0.000, 0.000, 0.000 ]
	],
	"edge": [
		[ 0.000, 9.000, 0.000 ],
		[ 9.000, -36.0, 9.000 ],
		[ 0.000, 9.000, 0.000 ]
	],
	"identity": [
		[ 0.000, 0.000, 0.000 ],
		[ 0.000, 9.000, 0.000 ],
		[ 0.000, 0.000, 0.000 ]
	],
	"mikesfav": [
		[ 2.000, 22.00, 1.000 ],
		[ 22.00, 1.000, -22.0 ],
		[ 1.000, -22.0, -2.00 ]
	],
	"custom": [
		[ 0.000, 0.000, 0.000 ],
		[ 0.000, 9.000, 0.000 ],
		[ 0.000, 0.000, 0.000 ]
	]
};

var _sourcePixelCache = null;
var _destPixelCache = null;

var _drawDestDelayHandle = null;

/**
 * Returns true if this browser supports canvas
 *
 * From http://diveintohtml5.info/
 */
function supportsCanvas() {
	return !!document.createElement('canvas').getContext;
}

/**
 * Get source pixels
 *
 * Since we'll probably reuse the source pixels several times (the user
 * will tend to select a source image and try a bunch of filters on it),
 * we cache the pixels until the source image is changed.
 */
function getSourcePixels() {
	if (_sourcePixelCache) {
		return _sourcePixelCache;
	}

	var scan = $('#cansrc').get(0);
	var sctx = scan.getContext('2d');

	_sourcePixelCache = sctx.getImageData(0, 0, scan.width, scan.height);

	return _sourcePixelCache;
}

/**
 * Get dest pixels
 *
 * Just like getSourcePixels(), but a little overwrought since we only
 * really need to get the dest pixels one time during the entire
 * application run.
 */
function getDestPixels() {
	if (_destPixelCache) {
		return _destPixelCache;
	}

	var dcan = $('#candest').get(0);
	var dctx = dcan.getContext('2d');

	_destPixelCache = dctx.getImageData(0, 0, dcan.width, dcan.height);

	return _destPixelCache;
}

/**
 * Invalidate source pixel cache
 */
function invalidateSourcePixelCache() {
	_sourcePixelCache = null;
}

/**
 * Get the current matrix values from the matrix inputs
 *
 * @return a 2D array containing the matrix values
 */
function getCurrentMatrix() {
	var r, c, mat = [[],[],[]], val;

	for (r = 0; r < 3; r++) {
		for(c = 0; c < 3; c++) {
			inputName = '#m' + r + c;
			val = parseFloat($(inputName).val());
			if (!val) { val = 0; }
			mat[r][c] = val;
		}
	}

	return mat;
}

/**
 * Draw the source image straight
 */
function drawSource() {
	var sctx = $('#cansrc').get(0).getContext('2d');
	var imageName = getSelectedImage();

	sctx.drawImage(images[imageName].img, 0, 0);
}

/**
 * Draw the destination image with filter
 *
 * This ignores the edges.
 */
function drawDest() {
	var scan = $('#cansrc').get(0);
	var dcan = $('#candest').get(0);
	var sctx = scan.getContext('2d');
	var dctx = dcan.getContext('2d');

	var r, c, h, sum;
	var width, height, width4;
	var centerRedIndex, upRedIndex, downRedIndex, chanIndex;

	// get pixels from source, and pixels for dest
	var spixels = getSourcePixels();
	var dpixels = getDestPixels();

	var spixelsData = spixels.data;
	var dpixelsData = dpixels.data;

	// get matrix values
	var mat = getCurrentMatrix();

	// apply convolution to non-border region

	width = scan.width;
	height = scan.height;
	width4 = width * 4;

	// row on dest/src image
	for (r = 1; r < width - 1; r++) {

		// each pixel is 4 channels (RGBA)--this is the first channel
		centerRedIndex = (r * width) * 4;
		
		// add 4 because we know we're starting at column 1, below:
		centerRedIndex += 4;

		// get relative up and down pixel
		upRedIndex = centerRedIndex - width4; // row above
		downRedIndex = centerRedIndex + width4; // row below

		// column on dest/src image
		for (c = 1; c < height - 1; c++) {

			// channel on dest/src image
			for (h = 0; h < 3; h++) {
				sum = 0;

				// matrix loops unrolled in here:

				// NW (northwest)
				// -4 because each pixel is 4 elements in the array,
				// and -4 goes left one pixel:
				chanIndex = (upRedIndex - 4) + h;
				sum += spixelsData[chanIndex] * mat[0][0];

				// N
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[0][1];

				// NE
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[0][2];

				// W
				chanIndex = (centerRedIndex - 4) + h;
				sum += spixelsData[chanIndex] * mat[1][0];

				// Center
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[1][1];

				// E
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[1][2];

				// SW
				chanIndex = (downRedIndex - 4) + h;
				sum += spixelsData[chanIndex] * mat[2][0];

				// S
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[2][1];

				// SE
				chanIndex += 4; // next pixel
				sum += spixelsData[chanIndex] * mat[2][2];

				// now we have the sum, apply the divisor and clamp:
				sum /= 9;
				sum = Math.min(Math.max(sum, 0), 255);

				// and store in the dest pixels
				dpixelsData[centerRedIndex+h] = sum;
			}

			// set alpha on this pixel to fully opaque:
			dpixelsData[centerRedIndex+3] = 0xff;

			// next pixel:
			centerRedIndex += 4;
			upRedIndex += 4;
			downRedIndex += 4;

		} // for cols
	} // for rows

	// store in dest canvas
	dctx.putImageData(dpixels, 0, 0);
}

/**
 * Draw source and dest
 */
function drawAll() {
	drawSource();
	drawDest();
}

/**
 * Get currently-selected image from pulldown
 */
function getSelectedImage() {
	return $('#imageselect').val();
}

/**
 * Get currently-selected filter from pulldown
 */
function getSelectedFilter() {
	return $('#filterselect').val();
}

/**
 * Loads the matrix inputs depending on which pulldown selection is made
 */
function loadMatrixInputs() {
	var vals, r, c, inputName;
	var fname = $('#filterselect').val();

	if (fname == "custom") { return; }

	vals = conv[fname];

	for (r = 0; r < 3; r++) {
		for(c = 0; c < 3; c++) {
			inputName = '#m' + r + c;
			$(inputName).val(vals[r][c]);
		}
	}
}

/**
 * Called with the image selector is changed
 */
function onImageSelectChanged() {
	invalidateSourcePixelCache();
	drawAll();

	return false;
}

/**
 * Called with the filter selector is changed
 */
function onFilterSelectChanged() {
	loadMatrixInputs();
	drawDest();

	return false;
}

/**
 * Schedule a drawDest() for later
 *
 * Ok, 5 ms later. I had visions of making this into something dynamic
 * that would improve response on slow devices, but even my phone does
 * OK, so I'm leaving it for now.
 */
function drawDestAfterDelay() {

	// if one's already scheduled, cancel it:
	if (_drawDestDelayHandle) {
		clearTimeout(_drawDestDelayHandle);
	}

	_drawDestDelayHandle = setTimeout(function() {
			_drawDestDelayHandle = null;
			drawDest();
		}, 5);
}

/**
 * Called when someone types in the matrix input
 *
 * This tries to prevent illegal input, but of course it's not very
 * robust. It's just a demo, after all.
 */
function onMatrixInputChanged(ev) {
	var charCode = ev.which;
	var keyCode = ev.keyCode;

	// Yes, I finally settled on this insanity because getting this
	// cross-browser was just seemingly-impossible any other way.
	//
	// Note that Chrome doesn't get keypress events on arrow keys,
	// backspace, or delete.

	// test legal characters
	if (!((charCode >= 48 && charCode <= 57) || // 0-9
		charCode == 45 ||  // -
		charCode == 46 ||  // .
		keyCode == 8 ||    // BS (really)
		keyCode == 9 ||    // TAB
		keyCode == 46 ||   // DEL
		keyCode == 37 ||   // LEFT
		keyCode == 39)) {  // RIGHT

		return false;
	}

	// if not an arrow key or tab,
	// set the filter selector to custom and draw
	if (keyCode != 37 && keyCode != 39 && keyCode != 9) {
		$('#filterselect').val('custom');

		// schedule a drawDest() for later, since we have to wait for
		// the browser to actually update the text fields:
		drawDestAfterDelay();
	}

	return true;
}

/**
 * on all images load complete
 */
function onFinishedLoading() {
	$('#loading').hide();
	$('#playarea').removeClass('hidden').addClass('playareashowing')

	// preload matrix input fields, then draw initial images:
	loadMatrixInputs();
	drawAll();

	// event handlers for pulldowns and inputs drive the rest of the
	// app:
	$('#imageselect').on('change', onImageSelectChanged);
	$('#filterselect').on('change', onFilterSelectChanged);
	$('.matrixinput').on('keypress', onMatrixInputChanged);
}

/**
 * Start images loading
 */
function loadImages(finishedCB) {
	var imageCount = 0, imageTotal = 0;
	var i, im;

	/**
	 * Callback when a single image has loaded
	 */
	function onSingleImageLoaded(ev) {
		$(ev.eventTarget).off('load', onSingleImageLoaded);
		imageCount++;

		if (imageCount == imageTotal) {
			// all done, notify via callback:
			finishedCB();
		}

		return false;
	}

	for (i in images) if (images.hasOwnProperty(i)) {
		im = images[i];

		im.img = new Image();
		$(im.img).on('load', onSingleImageLoaded);
		im.img.src = im.url;

		imageTotal++; // we have to load this many images
	}
}

/**
 * On ready
 */
$(function() {
	if (!supportsCanvas()) {
		$('#lamebrowser').show();
		return;
	}

	$('#loading').show();
	loadImages(onFinishedLoading);
});

})();
