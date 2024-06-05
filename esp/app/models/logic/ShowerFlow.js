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

        // Household
        var m = (report.household) ? e.reqres.request('household:size') :  1;

        // Duration Score (Already adjusted for household size!)
        var d = e.reqres.request('score:get:shower-duration') * m;

        // Values
        var choices = {
          Q3A2a: 2.5,
          Q3A2b: 5.0,
          Q3A2c: 3.8,
        };

        // Selection
        var c = choices[ input.choice ];

        // Breaks duration back down to core value:
        var bd = (d / m) / 5;

        // Re-calculates properly adjusted score using duration breakdown:
        var s = (bd * c) * m;

        // Determines the difference between original d calculation and new one
        score = s - d;

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
        //language awareness
        var choices = [];
        var userLang = e.reqres.request('session:get').userLang;
        if (userLang === "ESP") {
          choices = {
            Q3A2a: ' con ducha de bajo flujo',
            Q3A2b: ' con ducha de convencional',
            Q3A2c: ' con ducha de mixto'
          };
        } else {
          choices = {
            Q3A2a: ' with low-flow showerheads',
            Q3A2b: ' with conventional showerheads',
            Q3A2c: ' with mixed showerheads'
          };  
        }  
        return desc + choices[ input.choice ];

      } else {
        return desc;
      }
    }

  };

});
