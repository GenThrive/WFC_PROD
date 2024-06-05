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
          Q9B1a: 0,
          Q9B1b: 2,
          Q9B1c: 4
        };

        // Selection
        var c = choices[ input.choice ];

        // Score
        score = -(c * m);

        // Report
        report.message = '- (Choice: ' + c + ' * Household Size: ' + m + ')';
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
        if (userLang === "ESP") {
          choices = {
            Q9B1a: 'reciclo: nada el papel',
            Q9B1b: 'reciclo: un poco el papel',
            Q9B1c: 'reciclo: todo el papel'
          };
        } else {
           choices = {
            Q9B1a: 'no paper recycled',
            Q9B1b: 'some paper recycled',
            Q9B1c: 'all paper recycled'
          };
        }  
        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
