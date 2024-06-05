/*
* QuestionUIView
* Generic Question UI
*/

define(function( require ){

  require('marionette');
  var template = require("../templates/qui/generic");

  var QuestionUIView = Marionette.ItemView.extend({

    nom: "QuestionUIView",
    template: template,

    // maybe this sux.. but without it any common tap handlers in a super view won't know what to call it, unless there is a property to recall..
    gaEventCategory: "Question",


    // CUSTOMIZE: Events to handle back navigation and completion, custom ux.
    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .next-btn": "onNextBtnClick",
      });
    },


    // If previously answered, restore recorded inputs.
    onRender: function() {
      if ( this.model.get('input') ) {
        this.restore();
      }
    },

    // CUSTOMIZE: Restores input UI using previously recorded input values.
    restore: function() {
      this.$('#generic-input').val( this.model.get('input').genericValue );
    },

    // CUSTOMIZE: Records input values for future restoration.
    record: function() {
      return { genericValue: this.$('#generic-input').val() };
    },

    // CUSTOMIZE: Validation test (if any)
    validate: function() {
      return true;
    },

    // Just records inputs. this will trigger global score change.
    update: function() {
      this.model.save({
        input: this.record(),
        answered: true
      });
    },

    // Runs validation, records and completes.
    complete: function() {
      if ( this.validate() ) {
        this.update();
        this.model.onComplete();
        this.trigger('complete');
      }
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "complete"
      });
    },

    // Common: trigger back-navigation in QuestionView
    onPrevBtnClick: function(evt){
      evt.preventDefault();
      this.trigger('navigate:prev');
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "previous"
      });
    },

    onNextBtnClick: function(evt){
      evt.preventDefault();
      // no tracky here!
      this.complete();
    }
  });

  return QuestionUIView;

});
