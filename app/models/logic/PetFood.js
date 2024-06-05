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
        var i = Number(input.petFoodCost);
        report.message = 'Input: ' + i + ' * (200/30)';
        score = i * (200/30);

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

    describe: function() {
      var input = this.get('input');
      if (input) {

        return '$' + input.petFoodCost + ' per month on pet food';

      } else {
        return '$0 per month';
      }
    }

  };

});
