/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a ArrayBufferGC Singleton object
         * to use ALWAYS new it up mySingleton = new ArrayBufferGC()
         * @constructor
         */
        function ArrayBufferGC(){
	        if(ArrayBufferGC.prototype._singletonInstance){
		        return ArrayBufferGC.prototype._singletonInstance;
	        }

	        var windowURL = (
		            window.URL ||
			        window.webkitURL ||
			        window.mozURL ||
			        'notsupported'
		        );

	        if(!!window.Worker !== true){
		        throw 'Web Workers Not Supported';
	        }

	        var blob = null;
	        try {
		        blob = new Blob([''], {type:'application/javascript'})
	        } catch(err){
		        throw 'Blob not supported';
	        }

	        if(windowURL === 'notsupported'){
		        throw 'window.URL not supported';
	        } else {
		        //Set first instance
		        ArrayBufferGC.prototype._singletonInstance = this;

		        //Set up basic worker
		        var workerURL = windowURL.createObjectURL(blob);
		        var worker = new Worker(workerURL);
		        var workerData = [];

		        /**
		         * Move ref to WebWorker, so GC of this object happens on a different thread
		         * @param {ArrayBuffer} $arrayBuffer
		         */
		        this.dispose = function($arrayBuffer){
			        if($arrayBuffer.byteLength > 0){
				        workerData[0] = $arrayBuffer;
				        worker.postMessage($arrayBuffer, workerData);
				        workerData[0] = null;
			        }
		        };
	        }
        }
        
        //Return constructor
        return ArrayBufferGC;
    })();
});
