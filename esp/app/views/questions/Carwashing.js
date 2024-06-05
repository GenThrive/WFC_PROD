/*
* CarWashing Question View
*/

define(function(require){


  var QuestionUIView = require("./QuestionUIView");
  var CategoryUI = require('../ui/CategoryUI');
  var template = require("../templates/qui/carwashing");

  //access session for language awareness
  var e        = require("../../lib/WFCEvents");

  var CarWashing = QuestionUIView.extend({


    nom: "CarWashing",
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

       //language awareness
      var userLang = e.reqres.request('session:get').userLang;
      
      var cats = [];
      if (userLang === "ESP") {
        cats = this.model.get('input') || [
          {
            title: 'Con una manguera de jardín en casa',
            descriptor: 'veces por',
            name: 'hose',
            weight: 100,
            perPerson: false
          },
          {
            title: 'En un autolavado',
            descriptor: 'veces por',
            name: 'autowash',
            weight: 58,
            perPerson: false
          },
          {
            title: 'En un autolavado de autoservicio',
            descriptor: 'veces por',
            name: 'selfwash',
            weight: 15,
            perPerson: false
          }
        ];
      } else {
        cats = this.model.get('input') || [
          {
            title: 'A Garden Hose at Home',
            descriptor: 'time(s) per',
            name: 'hose',
            weight: 100,
            perPerson: false
          },
          {
            title: 'A drive-through car wash',
            descriptor: 'time(s) per',
            name: 'autowash',
            weight: 58,
            perPerson: false
          },
          {
            title: 'A self-service car wash',
            descriptor: 'time(s) per',
            name: 'selfwash',
            weight: 15,
            perPerson: false
          }
        ];
      }  
      this.categories = new Backbone.Collection( cats );
    },

    onRender: function() {

      this.categories.each( this.renderCategory );
      // this.enough();

      // Note: do not call this.restore(); within onRender
    },

    renderCategory: function( category ) {
      var catUI = new CategoryUI({ model: category });
      this.$('.category-container').append( catUI.render().el );

      this.listenTo( catUI, 'change', this.update, this );
      // this.listenTo( catUI, 'change', this.enough, this );
    },

    // Records input values for future restoration.
    record: function() {
      return this.categories.toJSON();
    },

    // This is really sophmoric validation logic...
    validate: function() {
      return true;
    },

    // enough: function() {
    //   if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    // }


  });


  return CarWashing;

});
