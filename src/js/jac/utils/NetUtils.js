/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 4/16/13
 * Time: 5:25 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(){
	return (function(){

		var NetUtils = {};

		/**
		 * Determine if XDomainRequest is defined on the passed in 'window'
		 * @param {Object} [$optWindow] window object from the browser
		 * @returns {boolean}
		 */
		NetUtils.needsXDomainRequest = function($optWindow){
			$optWindow = $optWindow || window;
			return 'XDomainRequest' in $optWindow && $optWindow.XDomainRequest !== null;
		};

		/**
		 * Creates an HTTPObject to make requests with (cross browser)
		 * @param {boolean} [$optIsCrossDomain]
		 */
		NetUtils.makeHTTPObject = function($optIsCrossDomain){
			if(typeof $optIsCrossDomain === 'undefined'){
				$optIsCrossDomain = false;
			}

			if($optIsCrossDomain === true && NetUtils.needsXDomainRequest()){
				return new XDomainRequest();
			}

			try {
				return new XMLHttpRequest();
			} catch (err) {}

			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			} catch (err) {}

			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch (err) {}

			throw new Error("Could not create HTTP request object.");
		};

		/**
		 * Makes a simple Cross Domain HTTPRequest (called immediately)
		 * @param {String} $url
		 * @param {Function} $callback
		 * @param {String} [$optRequestMethod] default is 'GET'
		 * @returns {Object} HTTPObject (or IE Equivalent)
		 */
		NetUtils.simpleXHTTPRequest = function($url, $callback, $optRequestMethod){
			var request = NetUtils.makeHTTPObject(true);

			if(NetUtils.needsXDomainRequest()){
				request.onload = function(){
					$callback(request);
				};
			}
			else {
				request.onreadystatechange = function(){
					$callback(request);
				};
			}

			var method = $optRequestMethod || 'GET';
			request.open(method, $url, true);
			request.send(null);

			return request;
		};

		/**
		 * Makes a simple HTTP request (called immediately)
		 * @param {String} $url
		 * @param {Function} $callback
		 * @param {String} [$optRequestMethod] default is 'GET'
		 */
		NetUtils.simpleHTTPRequest = function($url, $callback, $optRequestMethod){
			var request = NetUtils.makeHTTPObject();
			var method = $optRequestMethod || 'GET';
			request.open(method, $url, true);
			request.send(null);
			request.onreadystatechange = function(){
				$callback(request);
			};

			return request;
		};

		/**
		 * Takes a simple key/val map/object and makes a url param string
		 * eg. thing1=1&thing2=stuff&etc...
		 * @param {Object} $keyValObj
		 * @returns {String}
		 */
		NetUtils.keyValObjToUrlParamString = function($keyValObj){
			var str = '';
			var paramList = [];

			for(var myVar in $keyValObj){
				if($keyValObj.hasOwnProperty(myVar)){
					paramList.push(myVar + '=' + encodeURIComponent($keyValObj[myVar]));
				}
			}

			str = paramList.join('&');

			return str;
		};

		return NetUtils;
	})();
});