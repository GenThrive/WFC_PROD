/*
* Swimming Pool Use Question View
*/


define(function(require){


  var QuestionUIView = require('./QuestionUIView');
  var template = require('../templates/qui/swimming-pool-use');
  var SliderUI = require('../ui/SliderUI');


  var SwimmingPoolUse = QuestionUIView.extend({


    nom: 'SwimmingPoolUse',
    template: template,
    

    events: function(){
      return this.translateEvents({
        'tap .prev-btn': 'onPrevBtnClick',
        'tap .next-btn': 'onNextBtnClick'
      });
    },

    
    months: 0,

    // this view uses the SliderUI view, so GA tracking is captured there..
    // gaEventCategory: "none",

    initialize: function() {
      _.bindAll(this, ['restore', 'default']);
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      this.slider = new SliderUI();
      this.$('#months-covered').html( this.slider.render().el );
      this.listenTo(this.slider, 'slide', this.onSlide, this);
      this.listenTo(this.slider, 'update', this.onSliderUpdate, this);

      if ( this.model.get('input') ) {
        setTimeout(this.restore, 0);
      } else {
        setTimeout(this.default, 0);
      }
    },

    onSlide: function(val) {

      this.months = Math.round(val * 12);
      this.slider.setShuttleDisplay(this.months);
    },

    onSliderUpdate: function(val) {

      // This will actually be where all the magic happens, including
      // telling the slider what to display. The slider really just
      // handles the dragging interaction and reports back a %.

      this.months = Math.round(val * 12);
      this.slider.setShuttleDisplay(this.months);
      this.update();
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      this.slider.setShuttleDisplay( input.monthsCovered );
      this.slider.setValue( input.monthsCovered/12 );
    },

    default: function() {
      this.slider.setShuttleDisplay( 0 );
      this.slider.setValue( 0 );
    },

    // Records input values for future restoration.
    record: function() {
      return {
        monthsCovered: Math.round(this.slider.getValue() * 12)
      };
    }


  });


  return SwimmingPoolUse;
});
