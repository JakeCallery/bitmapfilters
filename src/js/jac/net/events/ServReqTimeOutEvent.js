/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */
define(['jac/events/JacEvent', 'jac/utils/ObjUtils'],
	function(JacEvent, ObjUtils){
	return (function(){

		/**
		 * Creates a ServReqTimeOutEvent object
		 * @param {String} $type
		 * @param {XMLHttpRequest} $request
		 * @extends {JacEvent}
		 * @constructor
		 */
		function ServReqTimeOutEvent($type, $request){
			//super
			JacEvent.call(this, $type);

			/** @type {XMLHttpRequest} */
			this.request = $request;
		}

		//inherit / extend
		ObjUtils.inheritPrototype(ServReqTimeOutEvent, JacEvent);

		/** @const */
		ServReqTimeOutEvent.TIME_OUT = 'servReqErrorEvent';

		//Return constructor
		return ServReqTimeOutEvent;
	})();
});