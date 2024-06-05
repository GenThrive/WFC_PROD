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

        // Household Size
       // var m = (report.household) ? e.reqres.request('household:size') :  1;

        // Values
        var choices = {
          Q6A1: -63,
          Q6A2: 0
        };

        // Selection
        var c = choices[ input.choice ];

        // Score
        score = c;
        
        // Report
        report.message = 'Choice: ' + c;

        // For non-household calculations, reduce this question by household size:
        if (!report.household) {
          var h = e.reqres.request('household:size');
          score = score / h;
          report.message += ' / household: ' + h;
        }

      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {
        //language awareness
        var choices = [];
        var userLang = e.reqres.request('session:get').userLang;
        if (userLang === "ESP") {
          choices = {
            Q6A1: "tengo sistema de aguas grises",
            Q6A2: "no tengo sistema de aguas grises"
          };
        } else {
          choices = {
            Q6A1: "do have a greywater system",
            Q6A2: "don't have a greywater system"
          };
        }  
        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
