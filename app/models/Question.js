/*
* Question
* Model for tracked inputs and progression through quiz nodes.

* Properties recorded by questions:

  answered:Boolean  Set when an input has been recorded I think this needs
                    to be more of a status including an "in progress" state.

  input:Object  Recorded inputs. Special for each question. Corresponds to
                Custom UI and feeds the calculation logic.

*/

define(function( require ){

  require('backbone');
  require('prettynames');

  // Model Logic Modules (required for bundle)
  require('./logic/BathroomSinkDuration');
  require('./logic/BathroomSinkFlow');
  require('./logic/Baths');
  require('./logic/Cars');
  require('./logic/Carwashing');
  require('./logic/DietDistribution');
  require('./logic/DietMeatServings');
  require('./logic/Dishes');
  require('./logic/Driving');
  require('./logic/ElectricityGeneration');
  require('./logic/ElectricityState');
  require('./logic/GreywaterSystem');
  require('./logic/Household');
  require('./logic/KitchenSinkDuration');
  require('./logic/KitchenSinkFlow');
  require('./logic/Laundry');
  require('./logic/LawnAndGarden');
  require('./logic/LawnAndGardenArea');
  require('./logic/LawnAndGardenXeriscape');
  require('./logic/LearnedTheMostAbout');
  require('./logic/MostInterestedIn');
  require('./logic/PetFood');
  require('./logic/RainBarrel');
  require('./logic/Fabrics');
  require('./logic/RecyclingMetalAndGlass');
  require('./logic/Paper');
  require('./logic/Plastic');
  require('./logic/ShoppingHabits');
  require('./logic/ShowerDuration');
  require('./logic/ShowerFlow');
  require('./logic/SwimmingPool');
  require('./logic/SwimmingPoolUse');
  require('./logic/ToiletFlow');
  require('./logic/ToiletMellow');
  require('./logic/VirtualWaterUse');

  var e   = require('../lib/WFCEvents');
  var env = require("../environment");

  return Backbone.Model.extend({

    nom: "Question",

    initialize: function() {
      // Get & install logic module.
      _.bindAll(this, ['installLogic', 'installFallbackLogic', 'report']);
      this.fetchLogic();
    },

    fetchLogic: function() {
      // Uses question slug to speculate custom logic module requirement path.
      var logicPath = './logic/' + this.getPascalCaseSlug();
      // console.log(logicPath);
      require([logicPath], this.installLogic, this.installFallbackLogic);
    },

    installFallbackLogic: function(err) {
      // Handles unfound custom logic modules by installing a generic one.
      // All questions should have custom logic modules, so this won't be needed.
      requirejs.undef( err.requireModules && err.requireModules[0] );
      require(["./logic/QuestionLogic"], this.installLogic);
    },

    installLogic: function(logic) {
      // Installs logic methods.
      _.extend(this, logic);
      // Runs logic utilities, if any.
      if (this.util) this.util();
      // Register to handle requests for this question's score:
      e.reqres.setHandler( 'score:get:' + this.get('slug'), this.calc, this );
      // Check-in with Questions collection.
      this.trigger('logic:installed');
    },

    // get the route from this question's slug (just prefix q/)
    getRoute: function(){
      return "/q/" + this.get("slug") + '/';
    },

    onStart: function() {
      this.save({'startTime': new Date()});
    },

    onComplete: function() {
      this.set('endTime', new Date());
      this.set('completionTime', new Date( this.get('endTime') ) - new Date( this.get('startTime') ));
      this.save();
      this.report();

      if (window.wfc_debug) {
        console.log("Completed In:", this.get('completionTime'));
      }
    },

    getTopic: function() {
      return e.reqres.request('topic:get', this.get('topic'));
    },

    getQuestionText: function() {
      var m = e.reqres.request('household:size');
      if (m > 1) {
        return (this.get('question').textGroup);
      } else {
        return (this.get('question').textIndividual);
      }
    },

    getQuestionArt: function() {
      if( $(window).width() < 481 ){
        return undefined;
      }

      var img = this.get('question').image;
      if (img) {
        var root = env.appRoot;
        img = img.replace(/^\/|\/$/g, '');
        return root + img;
      } else {
        return undefined;
      }
    },

    getTopicIcon: function() {
      var ico = this.get('topicIcon');
      if (ico) {
        var root = env.appRoot;
        ico = ico.replace(/^\/|\/$/g, '');
        return root + ico;
      } else {
        return undefined;
      }
    },

    // For converting question slugs into PascalCase:
    getPascalCaseSlug: function() {
      var pSlug = this.get('slug').replace(
        /(\w)(\w*)/g,
        function(g0,g1,g2){
          return g1.toUpperCase() + g2.toLowerCase();
        }
      ).replace(/-/g, '');
      return pSlug;
    },

    // GRACE Data Collection API
    report: function() {

      var data = {
        session: e.reqres.request('session:get'),
        KEY: this.strip( CryptoJS.MD5(e.reqres.request('session:get').sessionID) ),
        question: {
          questionID: this.get('id'),
          category: this.get('group'),
          title: this.get('topic'),
          text: this.strip( this.getQuestionText() ),
          nationalAverageScore: this.get('question').nationalAverage,
          tips: this.get('question').link
        },
        answer: {
          score: this.calc(),
          totalScore: e.reqres.request('score:current'),
          scoreDescription: this.getTopic().describe(),
          time: this.get('completionTime')
        }
      };

      if (window.wfc_debug) {
        console.log( "Reporing Response:", env.api.responsessURL );
        console.log( "Log:", data );
      }

      if (window.location.href.indexOf('localhost') === -1 && window.location.href.indexOf('10.32.10') === -1) {
        $.ajax({
          type: "POST",
          url: env.api.responsessURL,
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

    strip: function(html) {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }

  });
});
