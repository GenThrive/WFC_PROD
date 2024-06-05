/*
* WFCEvents
* Central Event Aggregator
*/

define(function( require ){

  require('backbone');
  require('marionette');

  return {
    vent     : new Backbone.Wreqr.EventAggregator(),
    commands : new Backbone.Wreqr.Commands(),
    reqres   : new Backbone.Wreqr.RequestResponse()
  };

});
