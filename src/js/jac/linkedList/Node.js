/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/utils/InterfaceUtils',
'jac/linkedList/ILinkedListable'],
function(InterfaceUtils, ILinkedListable){
    return (function(){
        /**
         * Creates a Node object for a linked list
         * @param {Object} [$obj] object to be stored in this node
         * @constructor
         */
        function Node($obj){
	        var self = this;
	        this.prev = null;
	        this.next = null;
	        this.obj = $obj;

	        if($obj !== undefined && $obj !== null && InterfaceUtils.objectImplements(this.obj, ILinkedListable)){
		        this.obj.linkedListNodeRef = self;
	        }

        }

        
        //Return constructor
        return Node;
    })();
});
