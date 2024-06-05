// Configure Paths/Exports for Non-AMD Libraries
require.config({
  urlArgs: "r=" + (new Date()).getTime(),
  paths:{
    jquery: "vendor/jquery",
    scrollto: "vendor/jquery.scrollTo",
    fastclick: "vendor/fastclick",
    underscore: 'vendor/lodash',
    backbone: 'vendor/backbone',
    localstorage: 'vendor/backbone.localStorage',
    marionette: 'vendor/backbone.marionette',
    prettynames: 'vendor/backbone.prettynames',
    handlebars: 'vendor/handlebars.runtime',
  },
  shim: {
    scrollto: {
      deps: ['jquery'],
      exports: 'scrollto'
    },
    underscore: {
      exports: '_'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    prettynames: {
      deps: ['backbone']
    },
    localstorage: {
      deps: ['backbone']
    },
    marionette: {
      deps: ['jquery', 'underscore', 'backbone', 'localstorage', 'prettynames'],
      exports: 'Backbone.Marionette'
    }
  }
});


