/*
* WFCRouter
* Router for App related routes.
*/

define(function( require ){

  require('marionette');
  var e             = require("../lib/WFCEvents");
  var WFCControllerESP = require("./WFCController");

  var WFCRouterESP = Backbone.Marionette.AppRouter.extend({


    controller: new WFCControllerESP(),
    appRoutes: {
      ''         : 'welcome',
      'q/*slug/' : 'question',
      'complete/': 'complete'
    },


    go: function( route ) {
      this.navigate( route, { trigger: true });
    },


    be: function( route ) {
      this.navigate( route, { trigger: false });
    },


    initialize: function() {
      e.commands.setHandler( 'route:go', this.go, this );
      e.commands.setHandler( 'route:be', this.be, this );
    },


  });
  return WFCRouterESP;
});
