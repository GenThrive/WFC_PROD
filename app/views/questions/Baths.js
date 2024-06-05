/*
* Baths Question View
*/

define(function(require){

  var QuestionUIView = require("./QuestionUIView");
  var template = require("../templates/qui/baths");
  var FrequencyUI = require("../ui/FrequencyUI");

  var Baths = QuestionUIView.extend({

    nom: "Baths",
    template: template,
    gaEventCategory: "Baths",
    

    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .next-btn": "onNextBtnClick"
      });
    },


    initialize: function() {
      _.bindAll(this, ['onSelect']);
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      this.frequency = new FrequencyUI({descriptor: 'bath(s) per'});
      this.$('#baths-frequency').html( this.frequency.render().$el );
      this.listenTo(this.frequency, 'update', this.update, this);

      if ( this.model.get('input') ) {
        this.restore();
      }
    },

    onSelect: function() {
      this.update();
    },

    serializeData: function() {
      return { descriptor: 'bath(s) per' };
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      this.frequency.setRate( input.rate );
      this.frequency.setFrequencyByValue( input.frequency );
    },

    // Records input values for future restoration.
    record: function() {
      return this.frequency.getValues();
    },

    // This is really sophmoric validation logic...
    validate: function() {
      return true;
    }

  });

  return Baths;

});
