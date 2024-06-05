/*
* QuestionLogic
*
* Generic question logic. This is not extended by other logic modules,
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

        // Household
        var m = (report.household) ? e.reqres.request('household:size') :  1;

        // Values
        var choices = {
          Q4A2a: 4,
          Q4A2b: 13,
          Q4A2c: 33,
          Q4A2d: 45,
        };

        // Selection
        var c = choices[ input.choice ];

        // Adjustment (assumes no low-flow)
        var a = 5;

        // Score
        score = c * a *  m;

        // Report
        report.message = 'Input: ' + c + ' * Assumed No Low-Flow:' + a + ' * Household Size: ' + m;
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var choices = {
          Q4A2a: 'under 5 min with ',
          Q4A2b: '5-20 min with ',
          Q4A2c: '21-45 min with ',
          Q4A2d: 'over 45 min with ',
        };

        return choices[ input.choice ] + desc;

      } else {
        return desc;
      }
    }

  };

});
