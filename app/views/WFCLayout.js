/*
* WFCLayout
* Top-level application layout.
*/

define(function( require ){

  require('marionette');
  var e         = require('lib/WFCEvents');
  var template  = require("./templates/wfclayout");

  var WFCLayout = Marionette.Layout.extend({

    nom        : "WFCLayout",
    template   : template,
    el         : 'body',
    regions    : {
      header   : "#header",
      score    : "#score",
      content  : "#content",
      progress : "#progress",
      report   : "#report",
      footer   : "#footer"
    },

    direction: 1,

    initialize: function() {

      e.commands.setHandler( 'layout:show', this.showViewInRegion, this );
      e.commands.setHandler( 'layout:close', this.closeRegion, this );
      e.reqres.setHandler( 'layout:currentview', this.getViewInRegion, this );
      e.commands.setHandler( 'layout:show:question', this.showQuestion, this );

    },

    testDirection: function( newView ) {
      if ( this.content.currentView ) {

        if ( this.content.currentView.id === 'ui-welcome' ) {
          return 1;
        }

        if ( this.content.currentView.id === 'ui-completion' ) {
          return -1;
        }

        var questions = e.reqres.request('question:get:all');
        var currentIndex = questions.indexOf( this.content.currentView.model );
        var newIndex = questions.indexOf( newView.model );

        if ( currentIndex !== -1 ) {
          if (currentIndex > newIndex ) {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 1;
        }

      } else {
        return 1;
      }
    },

    showViewInRegion: function( region, view ) {

      if ( this[ region ].curentView !== view ) {
        this[ region ].show( view );
      }

    },

    closeRegion: function( region ) {

      this[ region ].close();

    },

    getViewInRegion: function( region ) {

      return this[ region ].currentView;

    },

    showQuestion: function(view) {
      this.direction = this.testDirection(view);
      if ( this.content.currentView && this.content.currentView.id !== 'ui-welcome' && this.content.currentView.id !== 'ui-completion' ) {
        this.dismissQuestion(view);
      } else {
        this.presentQuestion(view);
      }
    },

    dismissQuestion: function(view) {
      var that = this;
      if (this.direction === 1) {
        this.content.$el.animate({left:'-100%'}, 333, 'swing', function(){
          that.presentQuestion(view);
        });
      } else if (this.direction === -1) {
        this.content.$el.animate({left:'100%'}, 333, 'swing', function(){
          that.presentQuestion(view);
        });
      }
    },

    presentQuestion: function(view) {
      this.content.show( view );
      if (this.direction === 1) {
        this.content.$el.css({left: '100%'});
      } else if (this.direction === -1) {
        this.content.$el.css({left: '-100%'});
      }
      this.content.$el.animate({left:0}, 333, 'swing');
    }

  });

  return WFCLayout;

});
