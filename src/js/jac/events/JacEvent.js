/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 4/16/13
 * Time: 3:23 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(){

	return(function(){

		/**
		 * Creates a JacEvent object to be used with jac.EventDispatcher
		 * @param {String} $type
		 * @param {Object} [$data]
		 * @constructor
		 */
		function JacEvent ($type, $data){
			this.target = undefined;
			this.currentTarget = undefined;
			this.type = $type;
			this.data = $data;
		}

		return JacEvent;
	})();

});