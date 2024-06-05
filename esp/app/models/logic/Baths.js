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

        var rate = Number(input.rate);
        var freq = Number(input.frequency);

        // custom maths.
        score = 35 * rate * freq;

        report.message = '35 * Rate: ' + rate + ' * Frequency: ' + freq;

        // For non-household calculations, reduce this question by household size:
        if (!report.household) {
          var h = e.reqres.request('household:size');
          score = score / h;
          report.message += ' / household: ' + h;
        }

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
          return input.rate + ' veces por ' + input.frequencyLabel;
        } else {
          return input.rate + ' per ' + input.frequencyLabel;
        }  

      } else {
        return desc;
      }
    }

  };

});
