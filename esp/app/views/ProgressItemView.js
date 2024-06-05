/*
* ProgressItemView
* Individual Question Item for ProgressView

* TODO: Questions really need a status other than 'answered'.
        A question that's in the process of being answered should
        be visually indicated and navigable.
*/

define(function( require ){

  require('marionette');
  var e        = require('../lib/WFCEvents');
  var template = require('./templates/progress-item');

  var ProgressItemView = Marionette.ItemView.extend({

    nom       : 'ProgressItemView',
    className : 'progress-node',
    template  : template,


    events: function(){
      return this.translateEvents({
        'tap' : 'onClick'
      });
    },


    initialize: function() {
      this.listenTo( this.model, 'change:answered', this.showAnswered, this );
      this.showAnswered();
      this.listenTo( this.model, 'change:closed', this.showClosed, this );
      this.showClosed();
      this.listenTo( this.model, 'question:current', this.showCurrent, this );
      this.model.onQuestion();
    },

    showAnswered: function() {
      this.$el.toggleClass('answered', this.model.get('answered') === true );
      this.$el.toggleClass('answering', this.model.get('answered') === false );
      this.$el.toggleClass('hidden', this.model.get('hidden') === true );
    },

    showCurrent: function() {
      $('.progress-node').removeClass('current');
      this.$el.addClass('current');

      $('.progress-group').removeClass('current');
      this.$el.closest('.progress-group').addClass('current now');
    },

    showClosed: function() {
      this.$el.toggleClass('closed', this.model.get('closed') === true);
    },

    onClick: function(evt) {
      console.log( evt );
      // Note: This is still firing for answered "dead" questions.
      if ( this.model.get('answered') !== undefined ) {
        e.commands.execute('route:go', '/q/'+ this.model.get('questions')[0].get('slug') +'/');
      }

      var label = this.model.get("topic");
      ga('send', 'event', {
        'eventCategory': "Progress Item",
        'eventAction': "tap",
        'eventLabel': label
      });
    }

  });

  return ProgressItemView;

});
