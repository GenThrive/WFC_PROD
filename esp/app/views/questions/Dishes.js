/*
* Dishes Question View
* CATEGORY FREQUENCY UI
*/

define(function(require){

  var QuestionUIView = require('./QuestionUIView');
  var CategoryUI = require('../ui/CategoryUI');
  var template = require('../templates/qui/dishes');

  //access session for language awareness
  var e        = require("../../lib/WFCEvents");
  var userLang = '';
      
  var Dishes = QuestionUIView.extend({

    nom: "Dishes",
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
      userLang = e.reqres.request('session:get').userLang;
      var cats = [];
      if (userLang === "ESP") {
          cats = this.model.get('input') || [
            {
              title: 'Lavavajillas a la antigua',
              descriptor: 'carga por',
              name: 'conventional',
              weight: 15,
              perPerson: false
            },
            {
              title: 'Lavavajillas eficiente',
              descriptor: 'carga por',
              name: 'efficient',
              weight: 4.3,
              perPerson: false
            },
            {
              title: 'A mano',
              descriptor: 'carga por',
              name: 'hand',
              weight: 27,
              perPerson: false
            },
            {
              title: 'Desechables o salir a comer',
              descriptor: 'veces por',
              name: 'dosposable',
              weight: 5.4,
              perPerson: true
            },
          ];
      } else {
          cats = this.model.get('input') || [
            {
              title: 'Old School Dishwasher',
              descriptor: 'load(s) per',
              name: 'conventional',
              weight: 15,
              perPerson: false
            },
            {
              title: 'Water/Energy Efficient Dishwasher',
              descriptor: 'load(s) per',
              name: 'efficient',
              weight: 4.3,
              perPerson: false
            },
            {
              title: 'With My Own Two Hands',
              descriptor: 'load(s) per',
              name: 'hand',
              weight: 27,
              perPerson: false
            },
            {
              title: 'Trash Them or Eat Out',
              descriptor: 'time(s) per',
              name: 'dosposable',
              weight: 5.4,
              perPerson: true
            },
          ];
      } 
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

  return Dishes;

});
