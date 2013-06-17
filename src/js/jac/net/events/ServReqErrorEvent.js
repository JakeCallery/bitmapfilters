/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */
define(['jac/events/JacEvent', 'jac/utils/ObjUtils'],
	function(JacEvent, ObjUtils){
	return (function(){

		/**
		 * Creates a ServReqErrorEvent object
		 * @param {String} $type
		 * @param {Object} $errorEvent
		 * @param {XMLHttpRequest} $request
		 * @extends {JacEvent}
		 * @constructor
		 */
		function ServReqErrorEvent($type, $errorEvent, $request){
			//super
			JacEvent.call(this, $type);

			/** @type {XMLHttpRequest} */
			this.request = $request;
			/** @type {Object} */
			this.errorEvent = $errorEvent;
		}

		//inherit / extend
		ObjUtils.inheritPrototype(ServReqErrorEvent, JacEvent);

		/** @const */
		ServReqErrorEvent.ERROR = 'servReqErrorEvent';

		//Return constructor
		return ServReqErrorEvent;
	})();
});