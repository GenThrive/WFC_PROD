/*
* WFCSession
* Session manager for WFC users.
* Bookeeping for locally stored session/quiz ids,
* as well as monitoring progression and the
*/

define(function( require ){

  var e = require('../lib/WFCEvents');
  var Session = require("../models/Session");
  var Questions = require("../models/Questions");

  var WFCSession = {


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
      var c = window.confirm('Are you sure? All saved progress will be lost!');
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

  return WFCSession;

});
