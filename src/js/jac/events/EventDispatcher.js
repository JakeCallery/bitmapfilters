/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 4/16/13
 * Time: 2:45 PM
 * To change this template use File | Settings | File Templates.
 */
define(['jac/events/JacEvent'], function (JacEvent) {
	return (function () {

		/**
		 * Standard EventDispatcher object
		 * @constructor
		 */
		function EventDispatcher() {
			/** @type {Array} */
			this.handlers = [];
		}

		/**
		 * Adds a handler function to the list
		 * @param {String} $type
		 * @param {Function} $handler
		 */
		EventDispatcher.prototype.addHandler = function ($type, $handler) {
			if (typeof this.handlers[$type] === 'undefined') {
				this.handlers[$type] = [];
			}

			this.handlers[$type].push($handler);
		};

		/**
		 * Removes a handler function from the list, based on type/handler signature
		 * @param {String} $type
		 * @param {Function} $handler
		 */
		EventDispatcher.prototype.removeHandler = function ($type, $handler) {
			if(this.handlers[$type] instanceof Array){
				var handlersForType = this.handlers[$type];
				for(var i = 0, len = handlersForType.length; i < len; i++){
					if(handlersForType[i] === $handler){
						//Found one, remove it from the list
						handlersForType.splice(i,1);
						break;
					}
				}
			}
		};

		/**
		 * removes all handlers for the specified type
		 * @param {String} $type
		 */
		EventDispatcher.prototype.removeAllHandlersByType = function($type){
			if(this.handlers[$type] instanceof Array){
				this.handlers[$type] = [];
			}
		};

		/**
		 * Fire an event to all attached handlers
		 * @param {JacEvent|Event} $event
		 */
		EventDispatcher.prototype.dispatchEvent = function($event){
			if(typeof $event.target === 'undefined' || $event === null){
				$event.target = this;
			}

			$event.currentTarget = this;

			if(this.handlers[$event.type] instanceof Array){
				var handlersForType = this.handlers[$event.type];
				for(var i = 0, len = handlersForType.length; i < len; i++){
					handlersForType[i]($event);
				}
			}

		};

		/**
		 * Bind a scope to a function (used mainly for callbacks and event handlers)
		 * @param {Object} $scope
		 * @param {Function} $function
		 * @param {...} $argsToCurry to curry during the call
		 * @returns {Function} bound function (delegate)
		 * @static
		 */
		EventDispatcher.bind = function($scope, $function, $argsToCurry){
			var args = Array.prototype.slice.call(arguments, 2);
			return function () {
				return $function.apply($scope, args.concat(Array.prototype.slice.call(arguments)));
			};
		};

		//Return the constructor
		return EventDispatcher;
	})();
});