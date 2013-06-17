/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Dictionary object
         * @param {Boolean} [$allowOverwrite=true]
         * @constructor
         */
        function Dictionary($allowOverwrite){
	        if($allowOverwrite === undefined){$allowOverwrite = true;}
	        var allowOverwrite = $allowOverwrite;
	        var keys = [];
	        var values = [];

	        this.put = function($key, $value){
				if(allowOverwrite || keys.indexOf($key) === -1){
					keys.push($key);
					values.push($value);
				}
	        };

	        this.get = function($key){
		        idx = keys.indexOf($key);
		        if(idx !== -1){
			        return values[idx];
		        } else {
			        return null;
		        }
	        };

	        this.removeByKey = function($key){
		        var idx = keys.indexOf($key);
		        if(idx !== -1){
			        keys.splice(idx,1);
			        values.splice(idx,1);
		        }
	        };

	        this.removeByValue = function($value){
		        for(var i = values.length-1; i >= 0; i--){
			        if(values[i] === $value){
				        keys.splice(i,1);
				        values.splice(i,1);
			        }
		        }
	        };

	        this.iterate = function($func){
		        for(var i = 0, l = keys.length; i < l; i++){
			        $func(keys[i], values[i]);
		        }
	        };

	        this.empty = function(){
		        keys = [];
		        values = [];
	        };
        }


        
        //Return constructor
        return Dictionary;
    })();
});
