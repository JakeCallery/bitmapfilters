/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */
define(['jac/events/JacEvent', 'jac/utils/ObjUtils'],
	function(JacEvent, ObjUtils){
	return (function(){

		/**
		 * Creates a ServReqProgressEvent object
		 * @param {String} $type
		 * @param {Object} $progressEvent
		 * @param {XMLHttpRequest} $request
		 * @extends {JacEvent}
		 * @constructor
		 */
		function ServReqProgressEvent($type, $progressEvent, $request){

			//super
			JacEvent.call(this, $type);

			/** @type {XMLHttpRequest} */
			this.request = $request;
			/** @type {Number} */
			this.position = $progressEvent.position;
			/** @type {Number} */
			this.totalSize = $progressEvent.totalSize;
		}

		//inherit / extend
		ObjUtils.inheritPrototype(ServReqProgressEvent, JacEvent);

		/** @const */
		ServReqProgressEvent.PROGRESS = 'servReqProgressEvent';

		//Return constructor
		return ServReqProgressEvent;
	})();
});