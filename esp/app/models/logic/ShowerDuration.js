/*
* ShowrDuration
*
* This is a basic multiple-choice pattern, which is pretty common.
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
          Q3A1a: 4,
          Q3A1b: 8,
          Q3A1c: 13,
          Q3A1d: 15,
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
            Q3A1a: 'menos de 5 min',
            Q3A1b: '5-10 min',
            Q3A1c: '11-15 min',
            Q3A1d: 'más de 15 min',
          };
        } else {
          choices = {
            Q3A1a: 'under 5 min',
            Q3A1b: '5-10 min',
            Q3A1c: '11-15 min',
            Q3A1d: 'over 15 min',
          };
        }  
        return desc + choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
