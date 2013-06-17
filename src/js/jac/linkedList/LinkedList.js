/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/linkedList/Node',
'jac/utils/InterfaceUtils',
'jac/linkedList/ILinkedListable'],
function(EventDispatcher,ObjUtils,Node,InterfaceUtils, ILinkedListable){
    return (function(){
        /**
         * Creates a LinkedList object
         * @extends {EventDispatcher}
         * @constructor
         */
        function LinkedList(){
            //super
            EventDispatcher.call(this);

	        this.head = null;
	        this.tail = null;
	        this.current = null;
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(LinkedList,EventDispatcher);

	    /**
	     *
	     * @param {Node} [$startNode=this.head]
	     * @returns {?Node}
	     */
	    LinkedList.prototype.getNext = function($startNode){
			if($startNode === undefined)
			{
				if(this.current === null)
				{
					this.current = this.head;
				} else {
					this.current = this.current.next;
				}
			} else {
				this.current = $startNode.next;
			}

		    return this.current;
	    };

	    LinkedList.prototype.resetCurrent = function(){
		    this.current = null;
	    };

	    /**
	     *
	     * @param {Object} $obj
	     */
	    LinkedList.prototype.addNode = function($obj){
			var n = new Node($obj);

		    if(this.head === null){
				this.head = n;
				this.tail = this.head;
			    this.current = this.head;
			} else {
				this.tail.next = n;
			    n.prev = this.tail;
			    this.tail = n;
			}

	    };

	    /**
	     *
	     * @param {Node} $node
	     */
	    LinkedList.prototype.removeNode = function($node){
            if(this.head === $node){
	            if($node.next !== null){
		            this.head = $node.next;
		            $node.next = null;
	            } else {
		            this.head = null;
	            }
            } else if(this.tail === $node){
				if($node.prev !== null){
					this.tail = $node.prev;
					$node.prev.next = null;
				} else {
					this.tail = null;
				}
            } else {
	            if($node.next !== null && $node.prev !== null){
		            $node.prev.next = $node.next;
		            $node.next.prev = $node.prev;
	            }
            }

		    if(this.current === $node){
			    this.current = this.head;
		    }

		    if($node.obj !== undefined && $node.obj !== null && InterfaceUtils.objectImplements($node.obj, ILinkedListable)){
			    $node.obj.linkedListNodeRef = null;
		    }

	    };

	    /**
	     *
	     * @param {Object} $obj
	     */
	    LinkedList.prototype.removeNodeByObject = function($obj){
		    var n = this.getNodeForObject($obj);
		    if(n !== null){
			    this.removeNode(n);
		    }

	    };

	    /**
	     * if the passed in object is ILinkListable, there is an optimization built in
	     * @param {Object} $obj
	     * @returns {?Node}
	     */
	    LinkedList.prototype.getNodeForObject = function($obj){
		    if(InterfaceUtils.objectImplements($obj, ILinkedListable)){
			    return $obj.linkedListNodeRef;
		    } else {
				if(this.head !== null){
					//iterate though, and find object
					var node = this.head;
					var obj = null;
					do {
						if(node.obj === $obj){
							//found
							return node;
						}

						//set up for next round
						node = node.next;

					} while(node !== null);
				}
		    }

		    return null;
	    };

        //Return constructor
        return LinkedList;
    })();
});
