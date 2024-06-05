/*
* FrequencyUI
* Spinner.
*/

define(function( require ){

  require('marionette');
  template = require('../templates/ui-frequency');

  //access session for language awareness
  var e        = require("../../lib/WFCEvents");
  var userLang = '';

  var FrequencyUI = Marionette.ItemView.extend({

    template: template,
    className: 'frequency-selector',
    
    events: function(){
      return this.translateEvents({
        'tap .ui-spinner.rate .ui-spinner-control.plus': 'increaseRate',
        'tap .ui-spinner.rate .ui-spinner-control.minus': 'decreaseRate',
        'tap .ui-spinner.frequency .ui-spinner-control.plus': 'increaseFrequency',
        'tap .ui-spinner.frequency .ui-spinner-control.minus': 'decreaseFrequency'
      });
    },

    frequencies: [
      {
        label: 'day',
        value: 1
      },
      {
        label: 'week',
        value: 0.14
      },
      {
        label: 'month',
        value: 0.03
      },
      {
        label: 'year',
        value: 0.003
      }
    ],
     
    rate: 0,

    initialize: function(options) {
      _.bindAll(this);
    },

    onRender: function() {
      this.setRate( 0 );
      this.setFrequency( 0 );
    },

    serializeData: function() {
      return this.options;
    },

    increaseRate: function(evt) {
      // evt.preventDefault();
      this.setRate( this.rate + 1);
      this.trigger('update');
      ga('send', 'event', {
        'eventCategory': "Frequency Input",
        'eventAction': "tap",
        'eventLabel': "Increase Rate"
      });
    },

    decreaseRate: function(evt) {
      // evt.preventDefault();
      if (this.rate > 0) {
        this.setRate( this.rate - 1);
        this.trigger('update');
      }
      ga('send', 'event', {
        'eventCategory': "Frequency Input",
        'eventAction': "tap",
        'eventLabel': "Decrease Rate"
      });
    },

    setRate: function(r) {
      this.rate = r;
      this.$('.ui-spinner.rate').attr( 'data-value', r );
      this.$('.ui-spinner.rate .ui-spinner-display').html( r );
      this.$('.ui-spinner.rate .ui-spinner-control.minus').toggleClass('dead', r === 0);
    },

    increaseFrequency: function(evt) {
      // evt.preventDefault();
      if (this.frequency < this.frequencies.length - 1) {
        this.setFrequency( this.frequency + 1 );
        this.trigger('update');
      }
      ga('send', 'event', {
        'eventCategory': "Frequency Input",
        'eventAction': "tap",
        'eventLabel': "Increase Frequency"
      });
    },

    decreaseFrequency: function(evt) {
      // evt.preventDefault();
      if (this.frequency > 0) {
        this.setFrequency( this.frequency - 1 );
        this.trigger('update');
      }
      ga('send', 'event', {
        'eventCategory': "Frequency Input",
        'eventAction': "tap",
        'eventLabel': "Decrease Frequency"
      });
    },

    setFrequency: function(f) {
      userLang = e.reqres.request('session:get').userLang;
      if (userLang === "ESP") {
          this.frequencies = [
          {
            label: 'día',
            value: 1
          },
          {
            label: 'semana',
            value: 0.14
          },
          {
            label: 'mes',
            value: 0.03
          },
          {
            label: 'año',
            value: 0.003
          }
        ];
      }  
      this.frequency = f;
      this.$('.ui-spinner.frequency').attr( 'data-value', this.frequencies[f].value );
      this.$('.ui-spinner.frequency .ui-spinner-display').html( this.frequencies[f].label );
      this.$('.ui-spinner.frequency .ui-spinner-control.minus').toggleClass('dead', f === 0);
      this.$('.ui-spinner.frequency .ui-spinner-control.plus').toggleClass('dead', f === this.frequencies.length - 1);
    },

    setFrequencyByValue: function(v) {
      var found = _.find(this.frequencies, function(f){
        return f.value === v;
      });
      this.setFrequency( this.frequencies.indexOf(found) );
    },

    getValues: function() {
      return {
        rate: Number( this.$('.ui-spinner.rate').attr('data-value') ),
        frequency: Number( this.$('.ui-spinner.frequency').attr('data-value') ),
        frequencyLabel: this.$('.ui-spinner.frequency').text()
      };
    }

  });

  return FrequencyUI;

});
