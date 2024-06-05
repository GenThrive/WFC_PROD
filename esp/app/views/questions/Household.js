/*
* Household Question View
*
* Household determines how many people the user is speaking for,
* establishes singular/plural context for future questions,
* and provides a multiplier for score contributions.
*/

define(function( require ){

  var QuestionUIView = require("./QuestionUIView");
  var template = require("../templates/qui/household");
  var env = require("../../environment");

  var Household = QuestionUIView.extend({

    nom: "Household",
    template: template,
    

    events:  function(){
      return this.translateEvents({
        "tap .next-btn": "complete",
        'tap .ui-spinner-control.minus': 'spinnerMinus',
        'tap .ui-spinner-control.plus': 'spinnerPlus',
      });
    },
    

    spinnerMin: 1,
    spinnerMax: 20,
    gaEventCategory: "Household",

    onRender: function() {
      if ( this.model.get('input') ) {
        this.restore();
      } else {
        this.updateSpinner(1);
      }
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      this.updateSpinner( this.model.get('input').numberOfPeople );
    },

    // Records input values for future restoration.
    record: function() {
      return { numberOfPeople: this.getSpinnerValue() };
    },

    updateSpinner: function(i) {
      this.$('.ui-spinner').attr( 'data-value', i );
      var $display = this.$('.ui-spinner-display');
      var cur = $display.find('img').length;
      if (cur < i) {
        _.times( i - cur, function(){ $display.append('<img  class="person_img" src="' + env.appRoot + 'images/person.png" alt="person" />'); });
      } else {
        _.times( cur - i, function(){ $display.find('img').first().remove(); });
      }
      this.$('.ui-spinner-control.plus').toggleClass('dead', i === this.spinnerMax);
      this.$('.ui-spinner-control.minus').toggleClass('dead', i === this.spinnerMin);
      this.$('.just-me span').toggleClass('hidden', i !== this.spinnerMin);
    },

    getSpinnerValue: function() {
      return Number( this.$('.ui-spinner').attr('data-value') );
    },

    spinnerMinus: function() {
      var val = this.getSpinnerValue();
      if ( val > this.spinnerMin) {
        this.updateSpinner( val - 1 );
        this.update();
      }
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Subtract from Household Count"
      });
    },

    spinnerPlus: function() {
      var val = this.getSpinnerValue();
      if ( val < this.spinnerMax) {
        this.updateSpinner( val + 1 );
        this.update();
      }
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Add to Household Count"
      });
    }

  });

  return Household;

});
