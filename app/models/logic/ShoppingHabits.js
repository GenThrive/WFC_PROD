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
        var m = (report.household) ? e.reqres.request('household:size') :  1;

        // Values
        var choices = {
          Q9A1: 291,
          Q9A2: 583,
          Q9A3: 1166
        };

        // Selection
        var c = choices[ input.choice ];

        // Score
        score = c * m;

        // Report
        report.message = 'Choice: ' + c + ' * Household Size: ' + m;
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
          Q9A1: 'shop for basics',
          Q9A2: 'like to shop',
          Q9A3: 'shop til you drop'
        };

        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
