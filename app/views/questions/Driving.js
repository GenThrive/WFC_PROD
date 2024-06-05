/*
* Driving
* Generic Question UI
*/

define(function( require ){

  require('marionette');
  var QuestionUIView = require('./QuestionUIView');
  var template = require("../templates/qui/driving");
  var SliderUI = require('../ui/SliderUI');

  var Driving = QuestionUIView.extend({
    nom: "Driving",
    template: template,

    // this view only uses the SliderUI element, so ga is tracked there..
    //gaEventCategory: "none",


    events: function(){
      return this.translateEvents({
        'tap .prev-btn': 'onPrevBtnClick',
        'tap .next-btn': 'onNextBtnClick'
      });
    },


    miles: 0,

    initialize: function() {
      _.bindAll(this, ['restore', 'default']);
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      this.slider = new SliderUI({threshold: 1});
      this.$('#miles-driven').html( this.slider.render().el );
      this.listenTo(this.slider, 'slide', this.onSlide, this);
      this.listenTo(this.slider, 'update', this.onSliderUpdate, this);

      if ( this.model.get('input') ) {
        setTimeout(this.restore, 0);
      } else {
        setTimeout(this.default, 0);
      }

      // this.enough();
    },

    onSlide: function(val) {

      // This will actually be where all the magic happens, including
      // telling the slider what to display. The slider really just
      // handles the dragging interaction and reports back a %.

      this.miles = Math.round(val * 2000);
      this.miles = Math.round(this.miles / 10) * 10;
      this.slider.setShuttleDisplay(this.miles);
      // this.enough();
    },

    onSliderUpdate: function(val) {

      // This will actually be where all the magic happens, including
      // telling the slider what to display. The slider really just
      // handles the dragging interaction and reports back a %.

      this.miles = Math.round(val * 2000);
      this.miles = Math.round(this.miles / 10) * 10;
      this.slider.setShuttleDisplay(this.miles);
      this.update();
      // this.enough();
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      this.slider.setShuttleDisplay( input.milesDriven );
      this.slider.setValue( input.milesDriven/2000 );
    },

    default: function() {
      this.slider.setShuttleDisplay( 0 );
      this.slider.setValue( 0 );
    },

    // Records input values for future restoration.
    record: function() {
      var val = this.slider.getValue() * 2000;
      val = Math.round(val / 10) * 10;
      return {
        milesDriven: val
      };
    },

    // enough: function() {
    //   if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    // }


  });

  return Driving;

});
