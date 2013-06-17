/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
       var VerboseLevel = {};

	    /** @const */ VerboseLevel.NORMAL = 0;
	    /** @const */ VerboseLevel.FILE = 2;
	    /** @const */ VerboseLevel.FUNCTION = 4;
	    /** @const */ VerboseLevel.LINE = 8;
	    /** @const */ VerboseLevel.TIME = 16;
	    /** @const */ VerboseLevel.LEVEL = 32;
	    /** @const */ VerboseLevel.FILEPATH = 64;

	    /** @const */
	    VerboseLevel.ALL = (VerboseLevel.NORMAL | VerboseLevel.FILEPATH | VerboseLevel.FILE |
                            VerboseLevel.FUNCTION | VerboseLevel.LINE | VerboseLevel.TIME | VerboseLevel.LEVEL);
        
        //Return constructor
        return VerboseLevel;
    })();
});
