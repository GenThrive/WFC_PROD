/*
* ElectricityState
* Generic Question UI
*/

define(function( require ){

  require('marionette');
  var QuestionUIView = require('./QuestionUIView');
  var template = require('../templates/qui/electricity-state');

  var ElectricityState = QuestionUIView.extend({
    nom: 'ElectricityState',
    template: template,
    gaEventCategory: "Electricity State",
    

    events: function(){
      return this.translateEvents({
        'tap .prev-btn': 'onPrevBtnClick',
        'tap .next-btn': 'onNextBtnClick',
        'change #state': 'onSelect'
      });
    },
    

    initialize: function() {
      _.bindAll(this, ['onSelect']);
    },

    onSelect: function(evt) {
      this.update();
      this.enough();

      var label = $(evt.currentTarget).find(":selected").text();
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': label
      });
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      if ( this.model.get('input') ) {
        this.restore();
      }
      this.enough();
    },

    // CUSTOMIZE: Restores input UI using previously recorded input values.
    restore: function() {
      this.$('#state').val( this.model.get('input').stateValue );
    },

    // CUSTOMIZE: Records input values for future restoration.
    record: function() {
      return {
        stateValue: this.$('#state').val(),
        stateName: this.$('#state').find(":selected").text()
      };
    },

    enough: function() {
      if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    }


  });

  return ElectricityState;

});
