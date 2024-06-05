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
          Q3C2a: 4,
          Q3C2b: 8,
          Q3C2c: 20,
          Q3C2d: 30,
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
        //language awareness
        var choices = [];
        var userLang = e.reqres.request('session:get').userLang;
        if (userLang === "ESP") {
          choices = {
            Q3C2a: 'menos de 5 min con ',
            Q3C2b: '5-10 min con ',
            Q3C2c: '11-30 min con ',
            Q3C2d: 'más de 30 min con ',
          };
        } else {
          choices = {
            Q3C2a: 'under 5 min with ',
            Q3C2b: '5-10 min with ',
            Q3C2c: '11-30 min with ',
            Q3C2d: 'over 30 min with ',
          };
        }  
        return choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
