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

        // Selection
        if (input.choice === "Q7B1") {
          score = -4;
          report.message = '-4';

          // For non-household calculations, reduce this question by household size:
          if (!report.household) {
            var h = e.reqres.request('household:size');
            score = score / h;
            report.message += ' / household: ' + h;
          }

        } else {
          report.message = 'No Rainwater Colloector.';
        }

        // Report
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        // Values
        var choices = {
          Q7B1: "do have a rain barrel",
          Q7B2: "don't have a rain barrel"
        };

        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
