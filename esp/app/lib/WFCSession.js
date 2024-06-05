/*
* WFCSessionESP 
* Session manager for WFC Spanish version.
* Separate session was necessary to avoid conflicts 
* when running both English and Spanish at the same time
* Bookeeping for locally stored session/quiz ids,
* as well as monitoring progression and the
*/

define(function( require ){

  var e = require('../lib/WFCEvents');
  var Session = require("../models/Session");
  var Questions = require("../models/Questions");

  var WFCSessionESP = {


    initialize: function() {
      _.bindAll(this);

      // Create session and fetch from localStorage.
      this.session = new Session();
      this.session.fetch({ complete: this.onSessionSuccess });

      // Global reset handler:
      e.commands.setHandler('global:reset', this.reset, this);
    },


    onSessionSuccess: function(){     
      
      // If no localStorage session found, generate a new ID and save.
      if( !this.session.get('sessionID') ){
        this.initializeSession();
      }
      this.questions = this.questions || new Questions();
      this.questions.fetchLocalData();
    },

    initializeSession: function() {
      this.session.generateSession();      
      this.session.save();
      if(window.wfc_debug) console.log("Session created: ", this.session.get('sessionID'));
    },

    initializeQuestions: function() {
      // Create questions collection and fetch from localStorage.
      this.questions = new Questions();
      this.questions.fetchLocalData();
    },

    reset: function() {
      console.log("Global Reset");
      //language awareness
      
      var userLang = e.reqres.request('session:get').userLang;
      var c = '';
      if (userLang === "ESP") {
        c = window.confirm('¿Estas seguro? Todo el progreso guardado se perderá!');
      } else {
        c = window.confirm('Are you sure? All saved progress will be lost!');
      }  
      if (c === true) {
        e.vent.once('session:ready', this.restart);
        this.session.generateQuiz();
        this.session.save();
        this.questions.destroyAll();
        this.questions.fetchLocalData();
      }
    },

    restart: function() {
      // Signal cleared/reinitialized session ready:
      e.vent.trigger('session:restart');
    }

  };

  return WFCSessionESP;

});
