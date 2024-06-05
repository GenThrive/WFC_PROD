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
      var h = 1; //default household size
      var a_ = e.reqres.request('score:get:lawn-and-garden-area');
        if (a_ === 0) {
          score = 0;
          return score;
        }
      
      var input = this.get('input');
      if ( input ) {

        // Lawn Area
        var a = e.reqres.request('score:get:lawn-and-garden-area');
        // The lawn score is already adjusted for the household size, so need to reverse it for this question        
        if (report.household) {
          h = e.reqres.request('household:size');
          a = a * h;
        }  

        if (this.getTopic().get('closed') ) {
          report.message = 'Topic closed, no contribution.';
          score = 0;
        } else {
          // Selection
          if (input.choice === "Q7A5a") {
            score = -( a * 0.25 ); // calc xeriscape
            report.message = ' - 0.25 * Lawn & Garden Area: ' + a;

            // For non-household calculations, reduce this question by household size:
            if (!report.household) { 
              score = score / h;
              report.message += ' / household: ' + h;
            }

          } else {
            report.message = 'No Xeriscaping.';
          }
        }

        // Report
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      
      var a_ = e.reqres.request('score:get:lawn-and-garden-area');
        if (a_ === 0) {
          return desc;
        }
      
      if (input) {

        var choices = {
          Q7A5a: ', do xeriscape',
          Q7A5b: ', don\'t xeriscape'
        };

        return desc + choices[ input.choice ];

      } else {        
       
        if (a_ === 0) {
          return desc;
        }
        
        return desc;
      }
    }

  };

});
