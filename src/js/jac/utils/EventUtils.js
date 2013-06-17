/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 4/16/13
 * Time: 4:53 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(){
	return (function(){

		var EventUtils = {};

		/**
		 * Crossbrowser way of attaching a handler to a DOM event dispatcher
		 * @param {Object} $domTarget
		 * @param {String} $type do not include the 'on'
		 * @param {Function} $handler
		 */
		EventUtils.addDomListener = function($domTarget, $type, $handler){
			if($domTarget.addEventListener){
				$domTarget.addEventListener($type, $handler, false);
			} else if($domTarget.attachEvent) {
				$domTarget.attachEvent('on'+$type, $handler);
			} else {
				$domTarget['on'+$type] = $handler;
			}
		};

		/**
		 * Crossbrowser way of removing a handler from a DOM event dispatcher
		 * @param {Object} $domTarget
		 * @param {String} $type
		 * @param {Function} $handler
		 */
		EventUtils.removeDomListener = function($domTarget, $type, $handler){
			if($domTarget.removeEventListener){
				$domTarget.removeEventListener($type, $handler, false);
			} else if($domTarget.detachEvent){
				$domTarget.detachEvent('on' + $type, $handler);
			} else {
				$domTarget['on'+$type] = null;
			}
		};

		/**
		 * Bind a scope to a function (used mainly for callbacks and event handlers)
		 * @param {Object} $scope
		 * @param {Function} $function
		 * @param {...} $argsToCurry to curry during the call
		 * @returns {Function} bound function (delegate)
		 */
		EventUtils.bind = function($scope, $function, $argsToCurry){
			var args = Array.prototype.slice.call(arguments, 2);
			return function () {
				return $function.apply($scope, args.concat(Array.prototype.slice.call(arguments)));
			};
		};



		return EventUtils;
	})();
});