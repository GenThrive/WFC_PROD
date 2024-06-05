/*
* HeaderView
* Header
*/

define(function( require ){

  require('marionette');
  var e = require('../lib/WFCEvents');
  var template = require("./templates/header");

  var HeaderView = Marionette.ItemView.extend({

    nom: 'HeaderView',
    template: template,
    id: 'ui-header',
    

    events: function(){
      return this.translateEvents({
        'tap #restart-button': 'restart',
        'tap #jump-question': 'scrollToQuestion',
        'tap #jump-graph': 'scrollToGraph',
        'tap #jump-table': 'scrollToTable',
      });
    },

    welcome: function() {
      this.$el.removeClass();
      this.$el.addClass( 'welcome' );
    },

    question: function() {
      this.$el.removeClass();
      this.$el.addClass( 'question' );
    },

    complete: function() {
      this.$el.removeClass();
      this.$el.addClass( 'complete' );
    },

    report: function( b ) {
      this.$el.toggleClass('report', b);
    },

    restart: function(evt){
      e.commands.execute('global:reset');

      ga('send', 'event', {
        'eventCategory': "Header",
        'eventAction': "tap",
        'eventLabel': "Reset"
      });
    },

    scrollToQuestion: function(evt) {
      evt.stopPropagation();
      $('html,body').animate({
                 scrollTop: 0
      }, 600);

      ga('send', 'event', {
        'eventCategory': "Header",
        'eventAction': "tap",
        'eventLabel': "Scroll to Question"
      });
    },

    scrollToGraph: function(evt) {
      evt.stopPropagation();
      $('html,body').animate({
                 scrollTop: $('#report-graph').offset().top
      }, 600);

      ga('send', 'event', {
        'eventCategory': "Header",
        'eventAction': "tap",
        'eventLabel': "Scroll to Graph"
      });
    },

    scrollToTable: function(evt) {
      evt.stopPropagation();
      $('html,body').animate({
                 scrollTop: $('#report-table').offset().top
      }, 600);

      ga('send', 'event', {
        'eventCategory': "Header",
        'eventAction': "tap",
        'eventLabel': "Scroll to Table"
      });
    }



  });

  return HeaderView;

});
