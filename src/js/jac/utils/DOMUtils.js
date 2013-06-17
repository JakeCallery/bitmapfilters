/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var DOMUtils = {};

	    /**
	     * Returns a supported property from a list, or empty string if not found
	     * @param {array} $propList list of strings to find as props
	     * @param {document} [$doc = document]
	     * @returns {String} the name of the supported prop or empty string if not found
	     */
	    DOMUtils.getSupportedProp = function($propList, $doc){
		    var doc = $doc || document;
		    var root = doc.documentElement;

		    for(var i = 0; i < $propList.length; i++){
			    if($propList[i] in root.style){
				    return $propList[i];
			    }
		    }
		    return '';

	    };

	    DOMUtils.addClass = function($domEl, $className){
		    $domEl.className += ' ' + $className;
	    };

	    DOMUtils.removeClass = function($domEl, $className){
		    var pattern = '(?:^|\\s)' + $className + '(?!\\S)';
		    var regEx = new RegExp(pattern,'g');
		    $domEl.className = $domEl.className.replace(regEx,'');
	    };

	    DOMUtils.hasClass = function($domEl, $className){
	        var pattern = '(?:^|\\s)' + $className + '(?!\\S)/)';
		    var regEx = new RegExp(pattern);
		    var result = $domEl.className.match(regEx);

		    if(result !== null){
			    return true;
		    } else {
			    return false;
		    }
	    };

	    DOMUtils.replaceClass = function($domEl, $classString){
		    $domEl.className = $classString;
	    };
        
        //Return constructor
        return DOMUtils;
    })();
});
