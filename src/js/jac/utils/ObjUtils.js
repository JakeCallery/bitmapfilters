/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Date: 4/16/13
 * Time: 4:37 PM
 * To change this template use File | Settings | File Templates.
 */
define(function(){
	return (function(){

		var ObjUtils = {};
		/**
		 * "Extends" the superType to the subType (pseudo subclassing)
		 * Add the "superClass" property that stores a reference to the $superType's prototype
		 * @param {Object} $subType
		 * @param {Object} $superType
		 */
		ObjUtils.inheritPrototype = function($subType, $superType){
			function TempCtor(){}
			TempCtor.prototype = $superType.prototype;
			$subType.superClass = $superType.prototype;
			$subType.prototype = new TempCtor();
			$subType.prototype.constructor = $subType;
		};

		/**
		 * create array from argument list
		 * @param {Object} $args the list of arguments in the 'arguments' property of a function
		 * @returns {Array}
		 */
		ObjUtils.argumentsToArray = function($args){
			return Array.prototype.slice.call($args);
		};

		/**
		 * Tries to determine if an object is an array
		 * @param {Object} $obj
		 * @returns {boolean}
		 */
		ObjUtils.isArray = function($obj){
			return Object.prototype.toString.call($obj) === '[object Array]';
		};

		ObjUtils.countProps = function($objMap){
			var count = 0;
			for(var prop in $objMap){
				count++;
			}
			return count;
		};

		return ObjUtils;
	})();
});