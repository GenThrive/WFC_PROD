/*
* Lawn and Garden Area Question View
*/

define(function(require){


  var QuestionUIView = require("./QuestionUIView");
  var template = require("../templates/qui/lawn-and-garden-area");
  var FrequencyUI = require("../ui/FrequencyUI");
  var SliderUI = require('../ui/SliderUI');

  //access session for language awareness
  var e        = require("../../lib/WFCEvents");

  var LawnAndGardenArea = QuestionUIView.extend({


    nom: "LawnAndGardenArea",
    template: template,
    id: 'ui-lawn-area',

    // this view only uses the SliderUI and FrequencyUI elements, so ga is tracked there..
    //gaEventCategory: "none",


    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .next-btn": "onNextBtnClick"
      });
    },


    areas: [{
        display: '1-99 SQ FT',
        value: 16.5
      },
      {
        display: '100-500 SQ FT',
        value: 99
      },
      {
        display: '500-1,000 SQ FT',
        value: 247.5
      },
      {
        display: '1,000 - 5,000 SQ FT',
        value: 990
      },
      {
        display: '5,000 - 10,000 SQ FT',
        value: 2470
      },
      {
        display: '10,000 - 40,000 SQ FT',
        value: 8250
      },
      {
        display: '1 ACRE (43,560)',
        value: 14375
      }
    ],


    initialize: function() {
      _.bindAll(this, ['restore', 'default']);
    },

    // If previously answered, restore recorded inputs.
    onRender: function() {
      this.slider = new SliderUI();
      this.$('#lawn-area').html( this.slider.render().el );
      this.listenTo(this.slider, 'update', this.onSliderUpdate, this);
      this.listenTo(this.slider, 'slide', this.onSlide, this);

      //language awareness
      var userLang = e.reqres.request('session:get').userLang;
      if (userLang === "ESP") {
        this.frequency = new FrequencyUI({descriptor: 'veces por'});
      } else {
        this.frequency = new FrequencyUI({descriptor: 'time(s) per'});
      }

      this.$('#water-frequency').html( this.frequency.render().$el );
      this.listenTo(this.frequency, 'update', this.onSelect, this);

      if ( this.model.get('input') ) {
        setTimeout(this.restore, 0);
      } else {
        setTimeout(this.default, 0);
      }

      this.enough();
    },

    onSelect: function() {
      this.update();
      this.enough();
    },

    onSlide: function(val) {
      this.area = this.areas[Math.round(val * (this.areas.length - 1))];
      this.slider.setShuttleDisplay(this.area.display);
      this.setArt();
      this.enough();
    },

    onSliderUpdate: function(val) {
      this.area = this.areas[Math.round(val * (this.areas.length - 1))];
      this.slider.setShuttleDisplay(this.area.display);
      this.update();
      this.setArt();
      this.enough();
    },

    setArt: function() {
      this.$('#lawn-small').toggleClass('hidden', this.slider.getValue() > 0.5);
      this.$('#lawn-large').toggleClass('hidden', this.slider.getValue() <= 0.5);
    },

    // CUSTOMIZE: Restores input UI using previously recorded input values.
    restore: function() {
      var input = this.model.get('input');
      var area = _.find(this.areas, function(a){ return a.value === input.lawnArea; });

      this.slider.setShuttleDisplay( area.display );
      this.slider.setValue( this.areas.indexOf(area)/(this.areas.length - 1) );

      this.frequency.setRate( input.rate );
      this.frequency.setFrequencyByValue( input.frequency );

      this.setArt();
      this.enough();
    },

    default: function() {
      var area = this.areas[0];
      this.slider.setShuttleDisplay( area.display );
      this.slider.setValue( this.areas.indexOf(area)/(this.areas.length - 1) );
      this.setArt();
      this.enough();
    },

    // CUSTOMIZE: Records input values for future restoration.
    record: function() {
      var area = this.areas[Math.round(this.slider.getValue() * (this.areas.length - 1))];
      return _.extend(this.frequency.getValues(), {
        lawnArea: area.value,
        lawnAreaLabel: area.display
      });
    },

    enough: function() {
      if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    }


  });


  return LawnAndGardenArea;

});
