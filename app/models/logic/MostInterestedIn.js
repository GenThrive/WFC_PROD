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
      var score = 0;
      return score;
    },

    describe: function() {
      var input = this.get('input');
      if (input) {

        return input.answer;

      } else {
        return '$0 per month';
      }
    }

  };

});
