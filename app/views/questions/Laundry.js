

/*
* Laundry Question View
* CATEGORY FREQUENCY UI
*/

define(function(require){

  var QuestionUIView = require('./QuestionUIView');
  var CategoryUI = require('../ui/CategoryUI');
  var template = require('../templates/qui/laundry');

  var Laundry = QuestionUIView.extend({

    nom: "Laundry",
    template: template,

    // this view only uses the CategoryUI and FrequencyUI elements, so ga is tracked there..
    //gaEventCategory: "none",


    events: function(){
      return this.translateEvents({
        "tap .prev-btn": "onPrevBtnClick",
        "tap .next-btn": "onNextBtnClick"
      });
    },


    initialize: function() {
      _.bindAll(this, ['renderCategory']);

      var cats = this.model.get('input') || [
        {
          title: 'Old School Washing Machine',
          descriptor: 'load(s) per',
          name: 'conventional',
          weight: 41,
          perPerson: false
        },
        {
          title: 'Water/energy Efficient Washing Machine',
          descriptor: 'load(s) per',
          name: 'efficient',
          weight: 20,
          perPerson: false
        },
        {
          title: 'Elbow Grease ',
          descriptor: 'load(s) per',
          name: 'hand',
          weight: 25,
          perPerson: false
        },
        {
          title: 'Laundromat or Pay Someone Else',
          descriptor: 'time(s) per',
          name: 'dosposable',
          weight: 38,
          perPerson: false
        },
      ];

      this.categories = new Backbone.Collection( cats );
    },

    onRender: function() {

      this.categories.each( this.renderCategory );
      this.enough();

      // Note: do not call this.restore(); within onRender
    },

    renderCategory: function( category ) {
      var catUI = new CategoryUI({ model: category });
      this.$('.category-container').append( catUI.render().el );

      this.listenTo( catUI, 'change', this.update, this );
      this.listenTo( catUI, 'change', this.enough, this );
    },

    // Records input values for future restoration.
    record: function() {
      return this.categories.toJSON();
    },

    // This is really sophmoric validation logic...
    validate: function() {
      return true;
    },

    enough: function() {
      if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    }


  });

  return Laundry;

});
