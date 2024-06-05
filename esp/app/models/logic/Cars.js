/*
* QuestionLogic
*
* Generic question logic. This is not extended by other logic modules,
* but is more of a template/guide and a temporary fallback for unfinished
* questions during development.
*/

define(function( require ){

  var e = require('../../lib/WFCEvents');

  return {

    // calc()'s must return a number representing the total score contribution.
    // (report) argument is a debugging object. Please add a "message".
    calc: function( report ) {
      report = report || {};
      var score = 0;
      var input = this.get('input');
      if ( input ) {

        // Values
        var choices = {
          Q7D1a: true,
          Q7D1b: false
        };

        // Selection
        var c = choices[ input.choice ];

        // Get the topic and close it based on choice.
        this.getTopic().set({closed: !c});

        // Also close the Driving Topic :)
        // driving = e.reqres.request('topic:get', 'Driving');
        // driving.set({closed: !c});


        // Score
        score = 0;

        // Report
        report.message = 'No score value. Has Cars: ' + c;
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {
        //language awareness
        var userLang = e.reqres.request('session:get').userLang;
        var choices = [];
        if (userLang === "ESP") {
          choices = {
            Q7D1a: "tengo coche",
            Q7D1b: "no tengo coche"
          };
        } else {
          choices = {
            Q7D1a: "do have a car",
            Q7D1b: "don't have a car"
          };
        }  
        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
