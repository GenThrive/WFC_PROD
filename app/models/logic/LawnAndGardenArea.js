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
        var a = Number(input.lawnArea);
        var r = Number(input.rate);
        var f = Number(input.frequency);
        // custom maths.

        if (this.getTopic().get('closed') ) {
          report.message = 'Topic closed, no contribution.';
          score = 0;
        } else {
          report.message = 'Area: ' + a + ' * Rate: ' + r + ' * Frequency: ' + f;
          score = a * r * f;

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

    progressValidation: function() {
      var input = this.get('input');
      return input && this.calc() > 0;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        if ( desc === 'do have') {

          var s = '';
          return input.lawnAreaLabel.toLowerCase() + ' watered ' + input.rate + ' time(s) per ' + input.frequencyLabel;

        } else {
          return desc;
        }

      } else {
        return desc;
      }
    }

  };

});
