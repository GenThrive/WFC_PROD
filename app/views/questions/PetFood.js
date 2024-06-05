/*
* PetFood
* Generic Question UI
*/

define(function( require ){

  require('marionette');
  var QuestionUIView = require('./QuestionUIView');
  var template = require('../templates/qui/pet-food');

  var PetFood = QuestionUIView.extend({
    nom: 'PetFood',
    template: template,
    gaEventCategory: "Pet Food",


    events: function(){
      return this.translateEvents({
        'tap .prev-btn': 'onPrevBtnClick',
        'tap .next-btn': 'onNextBtnClick',
        'tap .ui-spinner-control.minus': 'spinnerMinus',
        'tap .ui-spinner-control.plus': 'spinnerPlus'
      });
    },


    spinnerMin: 0,

    onRender: function() {
      if ( this.model.get('input') ) {
        this.restore();
      } else {
        this.updateSpinner(0);
      }
    },

    initialize: function() {
      _.bindAll(this, ['onSelect']);
    },

    onSelect: function() {
      this.update();
    },

    // CUSTOMIZE: Restores input UI using previously recorded input values.
    restore: function() {
      this.updateSpinner( this.model.get('input').petFoodCost );
    },

    // CUSTOMIZE: Records input values for future restoration.
    record: function() {
      return { petFoodCost: this.getSpinnerValue() };
    },

    updateSpinner: function(i) {
      this.$('.ui-spinner').attr( 'data-value', i );
      this.$('.ui-spinner-display').html('<span class="dollar">$</span>' + i);

      this.$('.ui-spinner-control.plus').toggleClass('dead', i === this.spinnerMax);
      this.$('.ui-spinner-control.minus').toggleClass('dead', i === this.spinnerMin);
    },

    getSpinnerValue: function() {
      return Number( this.$('.ui-spinner').attr('data-value') );
    },

    spinnerMinus: function() {
      var val = this.getSpinnerValue();
      if ( val > this.spinnerMin) {
        this.updateSpinner( Math.max(val - 5, 0) );
        this.update();
      }

      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Decrement Spend"
      });
    },

    spinnerPlus: function() {
      var val = this.getSpinnerValue();
      // console.log("plus", val);
      this.updateSpinner( val + 5 );
      this.update();

      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Increment Spend"
      });
    }


  });

  return PetFood;

});
