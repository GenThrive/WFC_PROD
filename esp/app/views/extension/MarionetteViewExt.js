/*
* Extending Marionette's Base View Class to give common event aggregating functionality to all app views.
*/

define(function(require){


  require("marionette");


  Marionette.View.prototype.translateEvents = function(eventHash){
    var newActionTarget;
    // if(!$("html").hasClass("touch")){
    if( true ) {
      for(var actionTarget in eventHash){
        if(actionTarget.indexOf("tap") === -1) continue;
        newActionTarget = actionTarget.replace("tap", "click");
        eventHash[newActionTarget] = eventHash[actionTarget];
        delete eventHash[actionTarget];
      }
    }
    //console.log("after translateEvents called, evt hash is", eventHash);
    return eventHash;
  };
    

});
