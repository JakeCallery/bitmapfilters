/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var InterfaceUtils = {};

	    /**
	     * Determine if an object has all of the required properties defined by the provided interfaces
	     * @param {Object} $obj an object to check to be sure it has all props in the provided interfaces
	     * @param {...Object} $interfaceArgs interface objects to get a property list from
	     * @returns {Boolean|String} true if valid, reason string if not
	     */
	    InterfaceUtils.objectImplements = function($obj, $interfaceArgs){
		    var paramCountMustBeExactMatch = false;
		    $interfaceArgs = Array.prototype.slice.call(arguments,1);

		    if($interfaceArgs[$interfaceArgs.length-1] === true){
			    paramCountMustBeExactMatch = true;
		    }

		    var propMap = {};
		    var propCount = 0;
		    var failReason = '';

		    //build prop map
		    for(var l = 0; l < $interfaceArgs.length; l++){
			    for (var p in $interfaceArgs[l]){
				    if($interfaceArgs[l].hasOwnProperty(p)){
					    if(!propMap.hasOwnProperty(p)){
						    propMap[p] = $interfaceArgs[l][p];
						    propCount++;
					    } else {
						    //TODO: this should allow interfaces with the same function names as long as the signatures/param counts match
						    throw new Error('two or more interfaces have the same property');
					    }

				    }
			    }
		    }

		    var foundProps = [];
		    var propFound = false;
		    for(var prop in propMap){
			    if(propMap.hasOwnProperty(prop)){
				    propFound = true;
				    if(foundProps.indexOf(prop) !== -1){continue;}  //previously found (probably not needed here)
				    if(prop in $obj){
					    //basic type check
					    if(typeof propMap[prop] !== typeof $obj[prop]){
						    if(failReason !== ''){failReason += '\n';}
						    failReason = 'Property types don\'t match for: ' + prop;
						    propFound = false;
					    } else if(typeof propMap[prop] === 'function'){
						    //if function, check param counts
						    if((paramCountMustBeExactMatch === true && propMap[prop].length !== $obj[prop].length) ||
							    (paramCountMustBeExactMatch === false && propMap[prop].length > $obj[prop].length)){
							    if(failReason !== ''){failReason += '\n';}
							    failReason = 'Argument count mismatch for function: ' + prop + ' in interface list';
							    propFound = false;
						    }
					    }

					    if(propFound === true){
						    //Found one
						    foundProps.push(prop);
						    propCount--;
					    }
				    }

			    }
		    }

		    if(propCount > 0){
			    //not all props found
			    var notFoundList = [];

			    //Remove found
			    for(var pl = 0; pl < foundProps.length; pl++){
				    if(propMap.hasOwnProperty(foundProps[pl])){
					    delete propMap[foundProps[pl]];
				    }
			    }

			    //add not found props (props remaining in the propMap)
			    for(var pr in propMap){
				    if(propMap.hasOwnProperty(pr)){
					    notFoundList.push(pr);
				    }
			    }

			    if(failReason !== ''){failReason += '\n';}
			    failReason += 'Interfaces not fully implemented, missing: ' + notFoundList;
		    }

		    if(failReason !== ''){
			    //failed
			    return failReason;
		    } else {
			    return true;
		    }

	    };

	    /**
	     * Determine if a class has all of the required functions defined by the passed in interfaces
	     * if inheritance is used, the constructor must have a superclass (from ObjUtils.inheritPrototype)
	     * !!CAUTION!! props must be on Class prototype to be considered implemented, props assigned in the
	     * constructor will not be detected! !!CAUTION!!
	     * Last argument should be set to {Boolean} true if the param counts must match exactly, otherwise
	     * <= will pass
	     * @param {Object} $class item to compare to interface
	     * @param {...Object} $interfaceArgs interface object to get a property list from
	     * @returns {Boolean|String} true if valid, reason string if not
	     */
	    InterfaceUtils.classImplements = function($class, $interfaceArgs){
			var paramCountMustBeExactMatch = false;
		    $interfaceArgs = Array.prototype.slice.call(arguments,1);

		    if($interfaceArgs[$interfaceArgs.length-1] === true){
			    paramCountMustBeExactMatch = true;
		    }

		    var failReason = '';

		    var propMap = {};
			var propCount = 0;

		    for(var l = 0; l < $interfaceArgs.length; l++){
				for (var p in $interfaceArgs[l]){
					if($interfaceArgs[l].hasOwnProperty(p)){
						if(!propMap.hasOwnProperty(p)){
							propMap[p] = $interfaceArgs[l][p];
							propCount++;
						} else {
							//TODO: this should allow interfaces with the same function names as long as the signatures/param counts match
							throw new Error('two or more interfaces have the same property');
						}

					}
				}
		    }

		    var tmp = $class;
		    var breakOut = false;
		    var foundProps = [];
		    var propFound = false;
		    do {
				for(var prop in propMap){
					if(breakOut === true){break;}
					if(propMap.hasOwnProperty(prop)){
						propFound = true;
						if(foundProps.indexOf(prop) !== -1){continue;}  //previously found
						if(tmp.hasOwnProperty(prop)){
							//basic type check prop
							if(typeof propMap[prop] !== typeof tmp[prop]){
								if(failReason !== ''){failReason += '\n';}
								failReason = 'Property types don\'t match for: ' + prop;
								propFound = false;
								breakOut = true;
							} else if(typeof propMap[prop] === 'function'){
								//if function, check param counts
								if((paramCountMustBeExactMatch === true && propMap[prop].length !== tmp[prop].length) ||
									(paramCountMustBeExactMatch === false && propMap[prop].length > tmp[prop].length)){
									if(failReason !== ''){failReason += '\n';}
									propFound = false;
									failReason = 'Argument count mismatch for function: ' + prop + ' in interface list';
									breakOut = true;
								}
							}

							//Found one
							if(propFound === true){
								foundProps.push(prop);
								propCount--;
							}
						}
					}
				}
				if(tmp.prototype){
					tmp = tmp.prototype
				} else if(tmp.hasOwnProperty('constructor') && tmp.constructor.hasOwnProperty('superClass')){
					tmp = tmp.constructor.superClass;
				} else {
					tmp = null;
				}

		    } while(propCount > 0 && tmp !== null && breakOut === false);

		    if(propCount > 0){
			    //not all props found
			    var notFoundList = [];

			    //Remove found
			    for(var pl = 0; pl < foundProps.length; pl++){
				    if(propMap.hasOwnProperty(foundProps[pl])){
					    delete propMap[foundProps[pl]];
				    }
			    }

			    //add not found props (props remaining in the propMap)
			    for(var pr in propMap){
				    if(propMap.hasOwnProperty(pr)){
					    notFoundList.push(pr);
				    }
			    }

			    if(failReason !== ''){failReason += '\n';}
			    failReason += 'Interfaces not fully implemented, missing: ' + notFoundList;
		    }

		    if(failReason !== ''){
			    //failed
			    return failReason;
		    } else {
			    return true;
		    }

	    };
        
        //Return constructor
        return InterfaceUtils;
    })();
});
