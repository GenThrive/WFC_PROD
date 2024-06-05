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

        // Duration Score (Already adjusted for household size!)
        var d = e.reqres.request('score:get:toilet-mellow');

        // Values
        var choices = {
          Q3D1a: 1.6,
          Q3D1b: 5.0,
          Q3d1c: 3.3,
        };

        // Selection
        var c = choices[ input.choice ];

        // Breaks duration back down to core value:
        var bd = (d / m) / 5;

        // Re-calculates properly adjusted score using duration breakdown:
        var s = (bd * c) * m;

        // Determines the difference between original d calculation and new one
        //mpg : updated score to reflect household number (added * m)
        score = (s - d) * m;

        // Report
        report.message = 'Low-Flow adjustment changed to: ' + c;
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var choices = {
          Q3D1a: 'low-flow toilets',
          Q3D1b: 'conventional toilets',
          Q3d1c: 'mixed toilets'
        };

        return desc + choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
