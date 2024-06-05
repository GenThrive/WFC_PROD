/*
* CompletionView
* View for quiz completion.
*/

define(function( require ){

  require('marionette');
  var e        = require('lib/WFCEvents');
  var template = require('./templates/completion');
  var env        = require("../environment");

  var CompletionView = Marionette.ItemView.extend({

    nom: 'CompletionView',
    template: template,
    id: 'ui-completion',
    gaEventCategory: "Quiz Complete",


    events: function(){
      return this.translateEvents({
        'tap #email-submit1': 'submitEmail1',
        'tap #email-submit2': 'submitEmail2',
        'tap #score-details'             : 'details',
        'click #twitter'     : 'twitter'
      });
    },


    serializeData: function() {
      return {
        rating: this.getRating(),
        score: e.reqres.request("score:current:formatted")
      };
    },


    getRating: function() {
      var rating = '';

      // Base comparison by household size: DEPRICATED
      // var score = Number( e.reqres.request('score:current') );
      // var house = Number( e.reqres.request('household:size') );
      // var scoreBase = score/house;

      var scoreBase = Number( e.reqres.request('score:current') );
      
      //language awareness
      var userLang = e.reqres.request('session:get').userLang;
      
      if (userLang === "ESP") {
        if (scoreBase <= 1200) {
            rating  = "¡Wow! Esa es una huella hídrica baja. No dude en presumirla.";
          }
          if (scoreBase > 1200 && scoreBase <= 1750) {
            rating  = "¡Bien! Está por debajo de la media. Explore sus respuestas y analice cómo puede disminuir su huella hídrica.";
          }
          if (scoreBase > 1750 && scoreBase <= 3000) {
            rating  = "Está de la media. Explore sus respuestas y analice cómo puede disminuir su huella hídrica.";
          }
          if (scoreBase > 3000) {
            rating  = "¡Es una cifra alta! Descubra por qué y cómo ahorrar agua a continuación.";
          }
      } else { 
          if (scoreBase <= 1200) {
            rating  = "Wow! That's a low water footprint. Feel free to brag about it.";
          }
          if (scoreBase > 1200 && scoreBase <= 1750) {
            rating  = "Not bad! You beat the average. Below you can explore your answers and find how to go lower.";
          }
          if (scoreBase > 1750 && scoreBase <= 3000) {
            rating  = "Your footprint is about average, so find how to lower it below.";
          }
          if (scoreBase > 3000) {
            rating  = "It’s high, right? Find out why and how to save water below.";
          }
      }    
      return rating;
    },


    onRender: function() {
      // Multiply national average by your house size: DEPRICATED
      // var house = Number( e.reqres.request('household:size') );
      // var houseAverage = nationalAverage * house;
      // this.$('.average-value').html( this.numberWithCommas(houseAverage) );

    },


    details: function( evt ) {
      e.vent.trigger('score:details');
      $('html,body').animate({
                  scrollTop: $('#report-graph').offset().top
      }, 600);

       ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Details"
      });
    },

    twitter: function(evt) {
      evt.preventDefault();
      var msg = "1,802 gal/día. ¡Esa es la huella hídrica promedio de alguien en los EE. UU! El mío es " + e.reqres.request('score:current:formatted') + " gal/día. Encuentre el suyo en calculadoradeagua.org";
      window.open('//twitter.com/home?status=' + encodeURIComponent(msg) );
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Twitter"
      });
    },

    submitEmail1: function() {
      console.log('EMAIL');
            
      var $input = this.$('#email-input1');
      console.log($input.val());
      $input.removeClass('error');
      var email = $input.val();
      if ( this.validateEmail(email) ) {
        this.$('#email-form').addClass('hidden');
        this.$('#email-confirmation').removeClass('hidden');
        //this.$('.top-email').addClass('hidden');
        this.report( email );
      } else {
        $input.addClass('error');
      }

      ga('send', 'event', {
        'eventCategory': "Report",
        'eventAction': "tap",
        'eventLabel': "Submit Email"
      });
    },
    
    submitEmail2: function() {
      console.log('EMAIL');
            
      var $input = this.$('#email-input2');
      $input.removeClass('error');
      var email = $input.val();
      if ( this.validateEmail(email) ) {
        this.$('#email-form').addClass('hidden');
        this.$('#email-confirmation').removeClass('hidden');
        this.report( email );
      } else {
        $input.addClass('error');
      }

      ga('send', 'event', {
        'eventCategory': "Report",
        'eventAction': "tap",
        'eventLabel': "Submit Email"
      });
    },
    
    validateEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    
    report: function( email ) {

      var data = {
        session: e.reqres.request('session:get'),
        email: email
      };

      if(window.wfc_debug) {
        console.log("Reporing Subscription:", env.api.subscriptionsURL);
        console.log("Subscription", data);
      }

      if (window.location.href.indexOf('localhost') === -1 && window.location.href.indexOf('10.32.10') === -1) {
        $.ajax({
          type: "POST",
          url: env.api.subscriptionsURL,
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            if(window.wfc_debug) console.log("Reporting Success", data);
          },
          failure: function(errMsg) {
            if(window.wfc_debug) console.log("Reporting Error", errMsg);
          }
        });
      }
    },

  });

  return CompletionView;

});
