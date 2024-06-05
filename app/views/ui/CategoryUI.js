/*
* CategoryUI
* Category Selection UI
*/

define(function( require ){

  require('marionette');
  var template = require("../templates/ui-category");
  var FrequencyUI = require("./FrequencyUI");

  var CategoryUI = Marionette.ItemView.extend({

    nom: "Category",
    template: template,
    className: 'category-ui',


    events: function(){
      return this.translateEvents({
        // added a space after "tap" here, so that the super translateEvents function picks this key up correctly
        'tap ': 'activate',
        'tap .category-status': 'deactivate',
        'change .frequency-selector': 'onSelect'
      });
    },


    initialize: function() {
      _.bindAll(this);
    },

    activate: function() {
      // Just visually activates:
      if ( !this.model.get('active') ) {
        this.$el.addClass('active');
        if (this.frequency && this.frequency.getValues().rate > 0) {
          this.model.set({'active': true});
        }
        this.trigger('change');
      }

      ga('send', 'event', {
        'eventCategory': "Category Input",
        'eventAction': "tap",
        'eventLabel': "Activate"
      });
    },

    deactivate: function(evt) {
      // Visually deactivates and saves inactive status.
      evt.stopPropagation();
      this.$el.removeClass('active');
      this.model.set({ active: false });
      this.trigger('change');

      ga('send', 'event', {
        'eventCategory': "Category Input",
        'eventAction': "tap",
        'eventLabel': "Deactivate"
      });
    },

    onSelect: function(evt) {
      // Gets Frequency Values
      var frequencyValues = this.frequency.getValues();
      if(window.wfc_debug) console.log( frequencyValues, frequencyValues.rate > 0 );
      // Sets rate and frequency.
      this.model.set( frequencyValues );
      // Activates only if rate is not zero. If it is, deactivates
      this.model.set({ active: frequencyValues.rate > 0 });
      this.trigger('change');

      // GA tracked in the frequency UI that emits this evt
    },

    onRender: function() {
      this.frequency = new FrequencyUI({descriptor: this.model.get('descriptor')});
      this.$('.category-selector').html( this.frequency.render().$el );
      this.listenTo(this.frequency, 'update', this.onSelect, this);


      if ( this.model.get('active') ) {
        this.$el.toggleClass( 'active' , this.model.get('active') );
      }
      if ( this.model.get('rate') ) {
        this.frequency.setRate( this.model.get('rate') );
      }
      if ( this.model.get('frequency') ) {
        this.frequency.setFrequencyByValue( this.model.get('frequency') );
      }
    }

  });

  return CategoryUI;

});
