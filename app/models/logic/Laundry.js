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
        var m = e.reqres.request('household:size');

        // Debugging message list per category pass.
        var messages = [];

        _.each( input, function(i){

          // If category was activated...
          if( i.active ) {
            var s = i.rate * i.frequency * i.weight;
            var message = i.title + ': Rate: ' + i.rate + ' * Frequency: ' + i.frequency + ' * Weight: ' + i.weight;

            if (i.perPerson) {
              s = s * m;
              message += ' * Household Size: ' + m;
            }

            messages.push( message );
            score += s;
          }
        });

        report.message = messages.join(' | ');

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

    progressValidation: function() {
      var input = this.get('input');
      return input && this.calc() > 0;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var s = '';
        _.each(input, function(i, n){
          if ( i.rate > 0 ) {
            if (s !== '') s += ', ';
                        
            s += i.title.toLowerCase() + ' '+ i.rate + ' ' + i.descriptor + i.frequencyLabel;
          }
        });

        if ( s !== '' ){
          return s;
        } else {
          return 'do not do laundry';
        }

      } else {
        return desc;
      }
    }

  };

});
