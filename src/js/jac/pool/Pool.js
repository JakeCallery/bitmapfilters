/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/pool/IPoolable',
'jac/utils/InterfaceUtils'],
function(IPoolable, InterfaceUtils){
    return (function(){
        /**
         * Creates an Pool of the specified object
         * @param {Function} $objCtor this object must have a property called 'poolable' that is set to true
         * @constructor
         */
        function Pool($objCtor){

	        var self = this;
	        //Quick poolable sanity check
	        var poolableResult = InterfaceUtils.classImplements($objCtor, IPoolable);
			if(poolableResult !== true){
				throw new Error(poolableResult);
			}

	        var ObjCtor = $objCtor;

	        var availStack = [];
	        var allPoolable = [];

	        /**
	         * Adds one new object to the pool
	         * @param {...} [$args] variadic args to pass to the init() function of the new object
	         * @returns {Object} the newly created object
	         * @private
	         */
	        var addOneToPool = function($args){
		        $args = Array.prototype.slice.call(arguments);
		        var obj = new ObjCtor();
		        obj.init.apply(obj, $args);
		        allPoolable.push(obj);
		        availStack.push(obj);

		        return obj;
	        };

	        /**
	         * gets an object from the pool.  if there are no free objects, a new on is created
	         * and added to the pool
	         * @param {...} [$args] arguments sent to the object init() function
	         * @returns {?Object} an object from the pool
	         */
	        this.getObject = function($args){
		        var obj = null;
				$args = Array.prototype.slice.call(arguments);
		        if(availStack.length > 0){
			        //Get from pool
			        obj = availStack.pop();

			        //init obj
			        obj.init.apply(obj, $args);
		        } else {
			        //Make new
			        obj = addOneToPool.apply(self, $args);
			        availStack.pop();
		        }

		        return obj;
	        };

	        /**
	         * returns an object to the pool
	         * @param {Object} $objFromPool
	         */
	        this.recycle = function($objFromPool){
				$objFromPool.recycle();
		        availStack.push($objFromPool);
	        };

	        /**
	         * make a set of new objects in the pool
	         * @param {int} $count how many new objects to add
	         * @param {...} [$args] variadic args to pass to the new object's init() function
	         */
	        this.fill = function($count, $args){
				for(var i = 0; i < $count; i++){
					var args = Array.prototype.slice.call(arguments,1);
					addOneToPool.apply(this, args);
				}

	        };

	        /**
	         * drains the pool, and frees up objects for GC
	         * @param {Boolean} [$forceObjRecycle=false]
	         */
	        this.drain = function($forceObjRecycle){
				$forceObjRecycle = ($forceObjRecycle === undefined)?false:$forceObjRecycle;

		        if($forceObjRecycle === true){
					for(var i = 0; i < allPoolable.length; i++){
						allPoolable[i].recycle();
					}
				}

		        //clear arrays
		        allPoolable = [];
		        availStack = [];
	        };

	        /**
	         * returns the number of available objects in the pool
	         * @returns {int}
	         */
	        this.getNumFree = function(){
		        return availStack.length;
	        };

	        /**
	         * returns the number of objects currently in use from the pool
	         * @returns {int}
	         */
	        this.getNumUsed = function(){
		        return allPoolable.length - availStack.length;
	        };

	        /**
	         * returns the total number of objects created for this pool (since the last drain)
	         * @returns {int}
	         */
	        this.getNumTotal = function(){
		        return allPoolable.length;
	        };

        }

        //Return constructor
        return Pool;
    })();
});
