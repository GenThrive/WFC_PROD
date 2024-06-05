/*
* Session
* User session model.
*/

define(function( require ){

  require('backbone');
  require('localstorage');
  var e = require('../lib/WFCEvents');

  var Session = Backbone.Model.extend({

    nom: "Session",
    localStorage : new Backbone.LocalStorage("WFCSessionESP"),  //differs from English version

    // LocalStorage requires that a single model have an id.
    // This ID must be constant so that future sessions can
    // find the same record every time.
    defaults: {
      id: 1,  //differs from English version which has id=0
      sessionID: null,
      quizID: null,
      userLang: null
    },

    initialize : function() {
      this.listenTo( e.vent, 'quiz:regenerate', this.generateQuiz, this );
      e.reqres.setHandler('session:get', this.getSession, this );
    },

    generateSession : function() {
      this.set( 'sessionID', this.uuid() );
      this.generateQuiz();
    },

    generateQuiz : function() {
      this.set( 'quizID', this.uuid() );
      this.generateLang();
    },

    generateLang : function() {
      this.set( 'userLang', this.getLang() );
      this.save();
    },

    getSession: function() {
      return {
        sessionID: this.get('sessionID'),
        quizID: this.get('quizID'),
        userLang: this.get('userLang')
      };
    },

    uuid : function() {
      //differs from English version which has -4xxx- instead of -5xxx-
      return 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    },

    getLang : function() {
      /*
      if (window.location.href.indexOf('esp') > -1 || window.location.href.indexOf('ESP') > -1) {
        return "ESP"; 
      } else {
        return ""; 
      }
      */
      return "ESP"; 
    }

  });

  return Session;

});
