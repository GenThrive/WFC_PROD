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

        if (this.getTopic().get('closed') ) {
          report.message = 'Topic closed, no contribution.';
          score = 0;
        } else {
          var mc = Number(input.monthsCovered);
          score = ( 18000 + (( 12 - mc ) * 1000)) / 365;
          
          report.message = '(18000 + (( 12 - Choice:' + mc + ' ) * 1000))/365)';

          // For non-household calculations, reduce this question by household size:
          if (!report.household) {
            var h = e.reqres.request('household:size');
            score = score / h;
            report.message += ' / household: ' + h;
          }

        }

      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        if ( desc === 'do have a swimming pool' ) {
          
          var freq = 'month';
          if (input.monthsCovered > 1) {
            freq = 'months';
          }
          
          return desc + ', ' + input.monthsCovered + ' '+ freq +' per year covered';
        } else {
          return desc;
        }

      } else {
        return desc;
      }
    }

  };

});