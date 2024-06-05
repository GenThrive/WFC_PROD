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
        // note these were switched due to the way the qustion is asked in spanish
        // previously Q3D2a = 1.7 , Q3D2b = 5.0 , Q3D2c = 3.4
        var choices = {
          Q3D2a: 5.0,
          Q3D2b: 1.7,
          Q3D2c: 3.4
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
            Q3D2a: 'siempre baja la palanca tras haber orinado con ',
            Q3D2b: 'nunca baja la palanca tras haber orinado con ',
            Q3D2c: 'a veces baja la palanca tras haber orinado con ',
          };
        } else {
          choices = {
            Q3D2a: 'do "let it mellow" with ',
            Q3D2b: 'don\'t "let it mellow" with ',
            Q3D2c: 'sometimes "let it mellow" with ',
          };
        }  
        return choices[ input.choice ] + desc;

      } else {
        return desc;
      }
    }

  };

});
