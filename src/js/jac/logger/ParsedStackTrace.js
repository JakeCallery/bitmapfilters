/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 * Stacktrace parsing partially borrowed from https://github.com/eriwen/javascript-stacktrace/blob/master/stacktrace.js
 */

define([],
function(){
    return (function(){
        /**
         * Creates a ParsedStackTrace object
         * @param {Error} [$err] error to create the stacktrace from
         * @param {Object} [$window]
         * @constructor
         */
        function ParsedStackTrace($err, $window){
			this.window = $window || window;
	        var mode = this.getMode($err);
	        var stackList = this.getStackList(mode, $err);

	        var tokens, protocol;
	        this.fileName = 'NST';
	        this.hostName = 'NST';
	        this.filePath = 'NST';
	        this.lineNumber = 'NST';
	        this.functionName = 'NST';
			this.hasStackTrace = false;

	        if(stackList !== undefined && stackList !== null && stackList.length > 0){
		        this.hasStackTrace = true;
		        var functionLine = this.getFunctionLine(stackList);

		        this.functionName = '{anonymous}';
		        if(functionLine.indexOf('{anonymous}()@') < 0){
			        //we have a real function name
			        this.functionName = functionLine.split(' ')[0];
			        this.functionName = this.functionName.split('@')[0];
		        }

		        functionLine = functionLine.replace(/(\(|\))/g,'');

		        tokens = functionLine.split('://');
		        protocol = tokens[0];
		        tokens = tokens[1].split(':');
		        if(mode == 'firefox'){
			        this.lineNumber = tokens[tokens.length-1];
		        } else {
			        this.lineNumber = tokens[tokens.length-2];
		        }
		        tokens = tokens[0].split('/');
		        this.fileName = tokens.pop();
		        this.hostName = tokens.shift();
		        this.filePath = tokens.join('/');
	        }
        }

	    /**
	     * returns the important line in the stack trace (after the logging stuff, but before the requireJS stuff)
	     * @param {Array} $stackList the stack trace in array form
	     * @returns {String}
	     */
	    ParsedStackTrace.prototype.getFunctionLine = function($stackList){
			return $stackList[4];
	    };

	    /**
	     *
	     * @param {String} $mode which browser stack trace format to expect
	     * @param {Error} $err error object from the browser
	     * @returns {Array.<String> | Null} Stack trace split into lines (1 line per array element)
	     */
	    ParsedStackTrace.prototype.getStackList = function($mode, $err){
			if($mode === 'otherBrowser'){
				//TODO: Maybe some day support other browsers
				return [];
			}
		    else if(typeof this[$mode] === 'function'){
				return this[$mode]($err);
			} else {
				//BAD MODE
				return null;
			}

	    };

	    /**
	     * Parse chrome style stack trace to list of strings
	     * @param {Error} $err
	     * @returns {Array.<String>}
	     */
	    ParsedStackTrace.prototype.chromeLike = function($err){
		    var stack = ($err.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
			    replace(/^\s+(at eval )?at\s+/gm, '').
			    replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
			    replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
		    stack.pop();
		    return stack;
	    };

	    /**
	     * Parse chrome style stack trace to list of strings
	     * @param {Error} $err
	     * @returns {Array.<String>}
	     */
	    ParsedStackTrace.prototype.chrome = function($err){
		    var stack = ($err.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
			    replace(/^\s+(at eval )?at\s+/gm, '').
			    replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
			    replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
		    stack.pop();
		    return stack;
	    };

	    /**
	     * Parse firefox style stack trace to a list of strings
	     * @param {Error} $err
	     * @returns {Array.<String>}
	     */
	    ParsedStackTrace.prototype.firefox = function($err){
		    return $err.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^[\(@]/gm, '{anonymous}()@').split('\n');
	    };

	    /**
	     * Parse IE style stack trace to a list of strings
	     * @param {Error} $err
	     * @returns {Array.<String>}
	     */
	    ParsedStackTrace.prototype.ie = function($err){
		    var lineRE = /^.*at (\w+) \(([^\)]+)\)$/gm;
		    return $err.stack.replace(/at Anonymous function /gm, '{anonymous}()@')
			    .replace(/^(?=\w+Error:).*$\n/m, '')
			    .replace(lineRE, '$1@$2')
			    .split('\n');
	    };

	    /**
	     * Parse safari style stack trace to a list of strings
	     * @param {Error} $err
	     * @returns {Array.<String>}
	     */
	    ParsedStackTrace.prototype.safari = function($err){
		    return $err.stack.replace(/\[native code\]\n/m, '')
			    .replace(/^(?=\w+Error\:).*$\n/m, '')
			    .replace(/^@/gm, '{anonymous}()@')
			    .split('\n');
	    };

	    /**
	     * Determine parsing mode via browser sniffing and/or feature detection
	     * @param {Error} $err
	     * @returns {string}
	     * @private
	     */
        ParsedStackTrace.prototype.getMode = function($err){
	        if (this.window.chrome && $err.stack) {
		        return 'chrome';
	        } else if ($err.stack && $err.sourceURL) {
		        return 'safari';
	        } else if ($err.stack && $err.number) {
		        return 'ie';
	        } else if ($err.stack && $err.hasOwnProperty('lineNumber')) {
		        return 'firefox';
	        } else if($err.stack){
		        return 'chromeLike';
	        }
	        return 'otherBrowser';
        };

        //Return constructor
        return ParsedStackTrace;
    })();
});
