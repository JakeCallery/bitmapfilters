/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/linkedList/Node',
'jac/utils/ObjUtils',
'jac/pool/IPoolable',
'jac/utils/InterfaceUtils',
'jac/linkedList/ILinkedListable'],
function(Node,ObjUtils, IPoolable, InterfaceUtils, ILinkedListable){
    return (function(){
        /**
         * Creates a PoolableNode object
         * @implements {IPoolable}
         * @extends {Node}
         * @constructor
         */
        function PoolableNode(){
            //super
            Node.call(this);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(PoolableNode,Node);

	    PoolableNode.prototype.init = function($args){
		    var self = this;
		    this.prev = null;
		    this.next = null;
		    this.obj = arguments[0];

		    if(this.obj !== undefined && this.obj !== null && InterfaceUtils.objectImplements(this.obj, ILinkedListable)){
			    this.obj.linkedListNodeRef = self;
		    }
	    };

	    PoolableNode.prototype.recycle = function(){
		    if(this.obj !== undefined && this.obj !== null && InterfaceUtils.objectImplements(this.obj, ILinkedListable)){
			    this.obj.linkedListNodeRef = null;
		    }

		    this.prev = null;
		    this.next = null;
		    this.obj = null;

	    };

        //Return constructor
        return PoolableNode;
    })();
});
