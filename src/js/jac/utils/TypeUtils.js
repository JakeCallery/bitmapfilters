/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        TypeUtils = {};

	    /**
	     * Usage TypeUtils.is.string('I am a string!');
	     * Original code from Jake Gordon (https://github.com/jakesgordon/javascript-gauntlet/blob/master/js/game.js)
	     */
	    TypeUtils.is = {
		    'string':         function(obj) { return (typeof obj === 'string');},
		    'number':         function(obj) { return (typeof obj === 'number');},
		    'bool':           function(obj) { return (typeof obj === 'boolean');},
		    'array':          function(obj) { return (obj instanceof Array);},
		    'undefined':      function(obj) { return (typeof obj === 'undefined');},
		    'func':           function(obj) { return (typeof obj === 'function');},
		    'null':           function(obj) { return (obj === null);},
		    'notNull':        function(obj) { return (obj !== null);},
		    'invalid':        function(obj) { return ( TypeUtils.is['null'](obj) ||  TypeUtils.is.undefined(obj));},
		    'valid':          function(obj) { return (!TypeUtils.is['null'](obj) && !TypeUtils.is.undefined(obj));},
		    'emptyString':    function(obj) { return (TypeUtils.is.string(obj) && (obj.length == 0));},
		    'nonEmptyString': function(obj) { return (TypeUtils.is.string(obj) && (obj.length > 0));},
		    'emptyArray':     function(obj) { return (TypeUtils.is.array(obj) && (obj.length == 0));},
		    'nonEmptyArray':  function(obj) { return (TypeUtils.is.array(obj) && (obj.length > 0));},
		    'document':       function(obj) { return (obj === document);},
		    'window':         function(obj) { return (obj === window);},
		    'element':        function(obj) { return (obj instanceof HTMLElement);},
		    'event':          function(obj) { return (obj instanceof Event);},
		    'link':           function(obj) { return (TypeUtils.is.element(obj) && (obj.tagName == 'A')); }
	    };

        //Return constructor
        return TypeUtils;
    })();
});
