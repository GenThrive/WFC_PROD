/*
* Electricity Generation Use Question View
*/


define(function(require){


  var QuestionUIView = require("./QuestionUIView");
  var template = require("../templates/qui/electricity-generation");
  var SliderUI = require('../ui/SliderUI');


  var ElectricityGeneration = QuestionUIView.extend({


    nom: "ElectricityGeneration",
    template: template,

    // this view only uses the SliderUI element, so ga is tracked there..
    // gaEventCategory: "none",

    
    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .next-btn": "onNextBtnClick"
      });
    },


    balance: 0,

    initialize: function() {
      _.bindAll(this, ['restore', 'default']);
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      this.slider = new SliderUI();
      this.$('#electricity-balance').html( this.slider.render().el );
      this.listenTo(this.slider, 'slide', this.onSlide, this);
      this.listenTo(this.slider, 'update', this.onSliderUpdate, this);

      if ( this.model.get('input') ) {
        setTimeout(this.restore, 0);
      } else {
        setTimeout(this.default, 0);
      }
    },

    onSlide: function(val) {
      this.balance = Math.round(val * 100);
      this.setValueDisplay(this.balance,1);
    },

    onSliderUpdate: function(val) {

      // This will actually be where all the magic happens, including
      // telling the slider what to display. The slider really just
      // handles the dragging interaction and reports back a %.

      this.balance = Math.round(val * 100);
      this.setValueDisplay(this.balance,1);
      this.update();
    },

    // Pre-configures input ui using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      this.slider.setValue( input.precentUtility/100 );
      this.setValueDisplay( 100 - input.precentUtility, 0 );
    },

    default: function() {
      this.slider.setValue( 1 );
    },

    // Records input values for future restoration.
    record: function() {
      return {
        precentUtility: Math.round(this.slider.getValue() * 100)
      };
    },

    setValueDisplay: function( value,initial ) {
       //console.log(initial+' '+value);
      value = Math.round(value/10) * 10;
      if (initial === 0 && value === 0) {
       value = 100;
      }else if(initial === 0 && value > 0){
        value = 100 - value;
      }
      //console.log(initial+' '+value);
      this.$('.slider-values .left').html(  (100 - value) + '%' );
      this.$('.slider-values .right').html( value + '%' );
    }


  });


  return ElectricityGeneration;
});
