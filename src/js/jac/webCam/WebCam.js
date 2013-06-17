/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/utils/EventUtils',
'jac/webCam/events/WebCamEvent'],
function(EventDispatcher,ObjUtils, EventUtils, WebCamEvent){
    return (function(){
        /**
         * Creates a WebCam object
         * @param {document} $document
         * @param {Navigator} $navigator
         * @param {Window} $window
         * @param {video} $videoEl
         * @extends {EventDispatcher}
         * @constructor
         */
        function WebCam($document, $navigator, $window, $videoEl){
            //super
            EventDispatcher.call(this);

	        this.document = $document;
	        this.navigator = $navigator;
	        this.window = $window;
			this.autoPlayVideo = true;
	        this.stream = null;

	        if($videoEl === undefined){
	            this.videoEl = this.document.createElement('video');
	        } else {
		        this.videoEl = $videoEl;
	        }

	        this.getMedia = (
		        this.navigator.getUserMedia ||
		        this.navigator.webkitGetUserMedia ||
		        this.navigator.mozGetUserMedia ||
		        this.navigator.msGetUserMedia
	        );

	        this.URL = (
		        this.window.URL ||
		        this.window.webkitURL ||
		        this.window.mozURL
	        );

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(WebCam,EventDispatcher);

	    /**
	     * Call this to grab the webcam and start capturing
	     * @param {boolean} $getVideo
	     * @param {boolean} $getAudio (where supported)
	     */
	    WebCam.prototype.init = function($getVideo, $getAudio){
		    var self = this;

		    if(this.successDelegate === undefined){
			    this.successDelegate = EventUtils.bind(self, self.handleCamSuccess);
		    }

		    if(this.errorDelegate === undefined){
			    this.errorDelegate = EventUtils.bind(self, self.handleCamError);
		    }

		    this.getMedia.call(
                this.navigator,
			    {video:$getVideo, audio:$getAudio},
			    self.successDelegate,
			    self.errorDelegate
		    );

	    };

	    /**
	     * Handler for camera connect success
	     * @param {Object} $localMediaStream stream object from the camera
	     * @private
	     */
	    WebCam.prototype.handleCamSuccess = function($localMediaStream){
		    var self = this;

		    //set up stream
		    this.stream = $localMediaStream;
		    EventUtils.addDomListener(this.stream, 'ended', EventUtils.bind(self, self.handleStreamEnded));
		    EventUtils.addDomListener(this.videoEl, 'loadedmetadata', EventUtils.bind(self, self.handleMetaData));
		    this.videoEl.src = this.URL.createObjectURL($localMediaStream);

		    if(this.autoPlayVideo === true){
			    this.videoEl.play();
		    }

		    this.dispatchEvent(new WebCamEvent(WebCamEvent.CONNECT_SUCCESS, $localMediaStream));
	    };

	    /**
	     * Handler for when we couldn't connect to the camera
	     * @param {Error} $err
	     * @private
	     */
	    WebCam.prototype.handleCamError = function($err){
		    this.dispatchEvent(new WebCamEvent(WebCamEvent.CONNECT_FAIL, $err));
	    };

	    /**
	     * Handler for the 'ended' event
	     * @param {Event} $e
	     * @private
	     */
	    WebCam.prototype.handleStreamEnded = function($e){
		    this.dispatchEvent(new WebCamEvent(WebCamEvent.STREAM_ENDED, $e));
	    };

	    /**
	     * Handler for when the video metadata is available
	     * @param {Event} $e
	     * @private
	     */
	    WebCam.prototype.handleMetaData = function($e){
		    this.dispatchEvent(new WebCamEvent(WebCamEvent.META_DATA_LOADED, $e));
	    };

	    /**
	     * Stops the recording / stream
	     */
	    WebCam.prototype.stop = function(){
		  if(this.stream !== null){
			  this.stream.stop();
		  }
	    };

	    /**
	     * checks to see if browser is supported
	     * @returns {boolean}
	     * @static
	     */
	    WebCam.checkSupport = function($navigator, $window){
		    var getMedia = (
				    $navigator.getUserMedia ||
				    $navigator.webkitGetUserMedia ||
				    $navigator.mozGetUserMedia ||
				    $navigator.msGetUserMedia ||
				    'notsupported'
			    );

		    var windowURL = (
				    $window.URL ||
				    $window.webkitURL ||
				    $window.mozURL ||
				    'notsupported'
			    );

		    return (getMedia !== 'notsupported' && windowURL !== 'notsupported');

	    };

        //Return constructor
        return WebCam;
    })();
});
