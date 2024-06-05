/*
* Cars Question View
*/

define(function(require){


  var QuestionUIView = require("./QuestionUIView");
  var template = require("../templates/qui/cars");


  var Cars = QuestionUIView.extend({


    nom: "Cars",
    template: template,
    gaEventCategory: "At Least One Car",
    

    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .multi-choice .pill-button.choice": "onChoice"
      });
    },

    initialize: function() {
      _.bindAll(this, ['onChoice']);
    },

    onChoice: function(evt) {
      this.$('.multi-choice .pill-button').removeClass('chosen');
      
      var tar = $(evt.currentTarget);
      tar.addClass('chosen');
      var evtLabel = tar.children()[0].innerHTML;
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': evtLabel
      });

      this.complete();
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      this.$( '#' + input.choice ).addClass('chosen');
    },

    // Records input values for future restoration.
    record: function() {
      return {
        choice: this.$('.pill-button.chosen').attr('id')
      };
    },

    // This is really sophmoric validation logic...
    validate: function() {
      return this.$('.multi-choice .pill-button.chosen').length;
    }


  });


  return Cars;

});
