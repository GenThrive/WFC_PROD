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
        var m = (report.household) ? e.reqres.request('household:size') :  1;
        var i = Number(input.stateValue);
        // custom maths.
        report.message = 'Input: ' + i + ' * Household Size: ' + m;
        score = i * m;
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    progressValidation: function() {
      var input = this.get('input');
      return input && Number(input.stateValue) > 0;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        return this.toTitleCase( input.stateName.toLowerCase() );

      } else {
        return desc;
      }
    },

    toTitleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

  };

});
