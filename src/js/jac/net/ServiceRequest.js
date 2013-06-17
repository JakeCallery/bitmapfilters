/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */
define(['jac/utils/ObjUtils', 'jac/events/EventDispatcher', 'jac/utils/EventUtils', 'jac/utils/NetUtils',
		'jac/net/events/ServReqEvent','jac/net/events/ServReqProgressEvent'],
	function(ObjUtils, EventDispatcher, EventUtils, NetUtils, ServReqEvent, ServReqProgressEvent) {
    return (function(){
    
        /**
         * Creates a ServiceRequest object
         * Default protocol is http and default port is 80
         * @param {String} $baseUrl
         * @param {String} $filePath
         * @param {Object|{}} [$reqVars] Key:Val pairs to use as request parameters
         * @param {String|'GET'} [$reqMethod] Defaults to 'GET'
         * @constructor
         */
        function ServiceRequest($baseUrl, $filePath, $reqVars, $reqMethod){
            //super
	        EventDispatcher.call(this);

	        //Private
	        var _baseUrl = $baseUrl;
	        var _filePath = $filePath;
	        var _reqVars = $reqVars || {};
	        var _urlVarsString = '';
	        var _reqMethod = $reqMethod || 'GET';
			var _httpObj = NetUtils.makeHTTPObject();
			var _reqUrl = '';

	        //Public
	        this.userName = null;
	        this.password = null;
	        this.currentError = null;
	        this.protocol = 'http';
			this.basePort = -1;
	        this.isAsync = true;
	        this.requestHeaders = [];

	        //Setup
	        //Format file path
	        if(_filePath.charAt(0) !== '/'){
		        _filePath = ('/' + _filePath);
	        }

	        _urlVarsString = NetUtils.keyValObjToUrlParamString(_reqVars);

	        //set up events
	        var self = this;
	        if(_httpObj.hasOwnProperty('onreadystatechange')){
		        _httpObj.onreadystatechange = EventUtils.bind(self, self.onReadyStateChange, _httpObj);
	        }

	        //This may not turn out to be useful
	        if(_httpObj.hasOwnProperty('onerror')){
		        _httpObj.onerror = EventUtils.bind(self, self.onError, _httpObj);
	        }

	        if(_httpObj.hasOwnProperty('onprogress')){
		        _httpObj.onprogress = EventUtils.bind(self, self.onProgress, _httpObj);
	        }

	        //This may not turn out to be useful
	        if(_httpObj.hasOwnProperty('ontimeout')){
		        _httpObj.ontimeout = EventUtils.bind(self, self.onTimeOut, _httpObj);
	        }

	        //region Privileged Methods
	        /**
	         * @returns {String} _baseUrl
	         */
	        this.getBaseUrl = function(){
		        return _baseUrl
	        };

	        /**
	         * @returns {String} _filePath
	         */
	        this.getFilePath = function(){
		      return _filePath;
	        };

	        /**
	         * @returns {Object=|{}}
	         */
	        this.getReqVars = function(){
		      return _reqVars;
	        };

	        /**
	         * @returns {String=|'GET'}
	         */
	        this.getReqMethod = function(){
		      return _reqMethod.toUpperCase();
	        };

	        /**
	         * @returns {?Object} _httpObj
	         */
	        this.getHTTPObj = function(){
		        return _httpObj;
	        };

	        /**
	         * @returns {string} _urlVarsString;
	         */
	        this.getUrlVarsString = function(){
		      return _urlVarsString;
	        };

	        /**
	         * @returns {string}
	         */
	        this.getTotalUrl = function(){
		        var port = '';
		        if(this.basePort != -1){
			        port = ':' + parseInt(this.basePort);
		        }
		        return (this.protocol + '://' + _baseUrl + port + _filePath);
	        };
	        //endregion

        }

	    //Do 'extend'
	    ObjUtils.inheritPrototype(ServiceRequest, EventDispatcher);

	    //Public methods
		ServiceRequest.prototype.send = function(){
			var http = this.getHTTPObj();

			if(this.getReqMethod() === 'GET'){
				http.open('GET', this.getTotalUrl() + '?' + this.getUrlVarsString(), this.isAsync, this.userName, this.password);

				for(var header in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(header)){
						http.setRequestHeader(header, this.requestHeaders[header]);
					}
				}

				http.send(null);
			}
			else if(this.getReqMethod() === 'POST'){
				http.open('POST', this.getTotalUrl(), this.isAsync, this.userName, this.password);

				//Add content-type header to list
				if(!('Content-type' in this.requestHeaders) && !('content-type' in this.requestHeaders) && !('Content-Type' in this.requestHeaders)){
					this.requestHeaders['Content-type'] = 'application/x-www-form-urlencoded';
				}

				//set request headers
				for(var headerKey in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(headerKey)){
						http.setRequestHeader(headerKey, this.requestHeaders[headerKey]);
					}
				}

				http.send(this.getUrlVarsString());
			}
		};

	    ServiceRequest.prototype.abort = function(){
			var http = this.getHTTPObj();
		    if(typeof http !== 'undefined'){
			    //Resets readyState to 0
			    http.abort();
		    }
	    };

	    ServiceRequest.prototype.onReadyStateChange = function($request){
		    var self = this;
			switch($request.readyState){
				case 4:
					//COMPLETE
					EventUtils.bind(self, self.handleRequestComplete, $request);
					break;
				case 0:
					//Request not initialized
					EventUtils.bind(self, self.handleReadyState0, $request);
					break;
				case 1:
					//Server Connection Established
					EventUtils.bind(self, self.handleReadyState1, $request);
					break;
				case 2:
					//Request Received
					EventUtils.bind(self, self.handleReadyState2, $request);
					break;
				case 3:
					//Processing Request
					EventUtils.bind(self, self.handleReadyState3, $request);
					break;
				default:
					console.log('Unhandled ReadyState: ' + $request.readyState);
					break;
			}

	    };

	    ServiceRequest.prototype.onError = function($request, $e){
		    this.dispatchEvent(new ServReqErrorEvent(ServReqErrorEvent.ERROR, $e, $request));
	    };

	    ServiceRequest.prototype.onProgress = function($request, $e){
		    this.dispatchEvent(new ServReqProgressEvent(ServReqProgressEvent.PROGRESS, $e, $request));
	    };

	    ServiceRequest.prototype.onTimeOut = function($request){
		    this.dispatchEvent(new ServReqTimeOutEvent(ServReqTimeOutEvent.TIME_OUT, $request));
	    };

	    ServiceRequest.prototype.handleRequestComplete = function($request){
		    this.dispatchEvent(new ServReqEvent(ServReqEvent.COMPLETE, $request));
	    };

	    ServiceRequest.prototype.handleReadyState0 = function($request){
		  //OVERRIDE ME
	    };

	    ServiceRequest.prototype.handleReadyState1 = function($request){
		  //OVERRIDE ME
	    };

	    ServiceRequest.prototype.handleReadyState2 = function($request){
		  //OVERRIDE ME
	    };

	    ServiceRequest.prototype.handleReadyState3 = function($request){
		    //OVERRIDE ME
	    };

        //Return constructor
        return ServiceRequest;
    })();
});