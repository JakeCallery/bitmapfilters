/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/EventDispatcher',
'jac/utils/ObjUtils',
'jac/events/JacEvent'],
function(EventDispatcher,ObjUtils, JacEvent){
    return (function(){
        /**
         * Creates a NotifyingDataObject object
         * @extends {EventDispatcher}
         * @constructor
         */
        function NotifyingDataObject(){
            //super
            EventDispatcher.call(this);

	        var self = this;
	        var data = {};
			var dispatcherList = [];

	        /**
	         * dispatches the events from all added dispatchers
	         * @param {JacEvent} $jacEvent
	         * @private
	         */
	        var notify = function($jacEvent){
				self.dispatchEvent($jacEvent);
		        for(var i = 0, l = dispatcherList.length; i < l; i++){
			        dispatcherList[i].dispatchEvent($jacEvent);
		        }
	        };

	        /**
	         * Adds 'watched' data to the notifying object
	         * @param {string} $propName
	         * @param {object} [$value]
	         */
	        this.addData = function($propName, $value){
				if(data.hasOwnProperty($propName)){
					self.setData($propName, $value);
				}else{
					data[$propName] = $value;
					notify(new JacEvent($propName + 'Added', $value));
				}
	        };

	        /**
	         * removes 'watched' data from the notifying object
	         * @param {string} $propName
	         */
	        this.removeData = function($propName){
				if(data.hasOwnProperty($propName)){
					delete data[$propName];
					notify(new JacEvent($propName + 'Removed'));
				}
	        };

	        /**
	         * updates 'watched' data (then notifies of the update)
	         * @param {string} $propName
	         * @param {Object} $value
	         */
	        this.setData = function($propName, $value){
				if(data.hasOwnProperty($propName)){
					data[$propName] = $value;
					notify(new JacEvent($propName + 'Changed', $value));
				} else {
					self.addData($propName, $value);
					notify(new JacEvent($propName + 'Changed', $value));
				}
	        };

	        /**
	         * returns the value specified by the $propName
	         * @param {string} $propName
	         * @returns {Object} returns undefined of the property doesn't exist
	         */
	        this.getData = function($propName){
				if(data.hasOwnProperty($propName)){
					return data[$propName];
				} else {
					return undefined;
				}
	        };

	        /**
	         * adds an EventDispatcher to the list of dispatchers that get notified
	         * @param {EventDispatcher} $evtDispatcher
	         */
	        this.addDispatcher = function($evtDispatcher){
				if($evtDispatcher instanceof EventDispatcher){
					dispatcherList.push($evtDispatcher);
				}

	        };

	        /**
	         * removes an EventDispatcher from the list of dispatchres that get notified
	         * @param {EventDispatcher} $evtDispatcher
	         */
	        this.removeDispatcher = function($evtDispatcher){
		        var idx = dispatcherList.indexOf($evtDispatcher);
		        if(idx != -1){
			        dispatcherList.splice(idx,1);
		        }
	        };

        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(NotifyingDataObject,EventDispatcher);
        
        //Return constructor
        return NotifyingDataObject;
    })();
});
