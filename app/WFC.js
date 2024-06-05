/*
* WFC:App
* Core Application Module
*/

define(function( require ){

  require('jquery');
  // require('tocca');
  require('scrollto');
  require('marionette');
  require('prettynames');
  require('custom');

  // not sure if this is the best place to do this, but I need to load a Marionette Extension file..
  require("views/extension/MarionetteViewExt");

  var FastClick  = require('fastclick');
  var e          = require("lib/WFCEvents");
  var env        = require("environment");
  var WFCSession = require("lib/WFCSession");
  var WFCLayout  = require("views/WFCLayout");
  var WFCRouter  = require("controllers/WFCRouter");
  var WFC        = new Marionette.Application();

  // Standup Modules
  WFC.addInitializer(function(){

    FastClick.attach(document.body);

    // Application Layout
    WFC.layout = new WFCLayout();
    WFC.layout.render();

    // Session module.
    WFCSession.initialize();

    // After all intializers are fired, start the history.
    e.vent.once('session:ready', function(){

      // Application Router
      WFC.router = new WFCRouter();

      Backbone.history.start({ pushState: true, root: env.appRoot });
      if (typeof Object.freeze === "function") {
        Object.freeze(this);
      }

    });
  });
  
  


  /*
  * DEBUGGING:
  * Attach Event Aggregator and Applcation Instance to Window
  */
  // window.e = e;
  // window.wfc = WFC;

  return WFC;

});
