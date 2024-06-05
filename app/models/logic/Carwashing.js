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
          // Household Size
          var m = (report.household) ? e.reqres.request('household:size') :  1;

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
        }

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
    
      var cleanDesc = desc.replace("'","");
      
        if ( desc !== 'don\'t have a car' || cleanDesc !== 'dont have a car' ) {

          var s = '';
          _.each(input, function(i, n){
            if ( i.rate > 0 ) {
              if (s !== '') s += ', ';
              
              s += i.rate + ' ' + i.descriptor + i.frequencyLabel + ' with ' + i.title.toLowerCase();
            }
          });
          if ( s !== '' ){
            return s;
          } else {
            return 'do not wash';
          }

        } else {
          return desc;
        }

      } else {
        return desc;
      }
    }

  };

});
