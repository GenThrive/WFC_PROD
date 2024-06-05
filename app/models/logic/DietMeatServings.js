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

          score = (input.noteveryday * 596) + (input.onceaday * 768) + (input.twiceaday * 939) + (input.everymeal * 1283);
          report.message = 'score of '+ score + ' ( noteveryday: ' + input.noteveryday + ' * 596)( onceaday: ' + input.onceaday + ' * 768) + ( twiceaday: ' + input.twiceaday + ' * 939) + ( everymeal: ' + input.everymeal + ' * 1283)';

          //if there are answers, do some math
          if (score > 0) { 
            var household = e.reqres.request('household:size');
            var meaties = input.noteveryday + input.onceaday + input.twiceaday + input.everymeal;
            var meatiesAvgScore = score / meaties;
            var hippies = household - meaties;
            var hippiesAvgScore = 0;
            
            if ( hippies > 0){
              hippiesAvgScore = ((e.reqres.request('score:get:diet-distribution')*household)-(1283*meaties))/hippies;
            }

            // Weighted Average of all assigned diet people.
            var weightedAverage = ( ( hippies * hippiesAvgScore ) + ( meaties * meatiesAvgScore ) ) / ( meaties + hippies );
            score = weightedAverage - (e.reqres.request('score:get:diet-distribution'));

            // Remove the hippie score from the full, weighted average
            if(report.household) {
              score = (hippiesAvgScore*hippies)+(meatiesAvgScore*meaties)-(e.reqres.request('score:get:diet-distribution')*household);
            }
            /*  
             console.log('weightedAverage', weightedAverage); 
             console.log('hippiesAvgScore', hippiesAvgScore);
             console.log('hippies', hippies);
             console.log('meatiesAvgScore', meatiesAvgScore);
             console.log('meaties', meaties);
             console.log('score', score);
             console.log('hhscore', e.reqres.request('score:household'));
            */
            report.message += ' ...weighted average calculated based on a non-meat eating score of ' + hippiesAvgScore + '  by ' + hippies + ' non-meat-eaters.';
            // console.log("Diet Meat Servings:", score, report.message);
          }
         
        }
      } else {
        report.message = 'No recorded inputs.';
      }
      // console.log(score);
      
      return score;
    },

    util: function() {
      _.bindAll(this, ['reduceAssignments']);
      e.commands.setHandler('meat:overage', this.overage, this);
    },

    // recalculate the number of meat eaters in case the user goes back and
    // changes the household diet distribution 
    overage: function() {
      var input = this.get('input');
      if (input) {
        var numMeatEaters = e.reqres.request('diet:meat-eaters');
        var numAssigned = input.noteveryday + input.onceaday + input.twiceaday + input.everymeal;
        var overage = numAssigned - numMeatEaters;

        if(window.wfc_debug) console.log("meat overage:", numAssigned, '-', numMeatEaters, '=', overage);

        if ( overage > 0) {
          _.times(overage, this.reduceAssignments);
        }
      }  
    },

    reduceAssignments: function() {
      if(window.wfc_debug) console.log("Reducing meat assignments.");
      var input = this.get('input');
      if (input.everymeal > 0) {
        input.everymeal -= 1;
      } else if (input.twiceaday > 0) {
        input.twiceaday -= 1;
      } else if (input.onceaday > 0) {
        input.onceaday -= 1;
      } else if (input.noteveryday > 0) {
        input.noteveryday -= 1;
      }
      this.set('input', input);
    },

    progressValidation: function() {
      var input = this.get('input');
      var total = 0;
      var meaties;

      if (input) {
        meaties = e.reqres.request('diet:meat-eaters');
        total = input.noteveryday + input.onceaday + input.twiceaday + input.everymeal;
      }

      return input && total === meaties;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var unit;
        if (input.noteveryday > 0) {
          if ( desc !== '' ) desc += ', ';
          unit = ( input.noteveryday === 1 ) ? ' meat eater' : ' meat eaters';
          desc += input.noteveryday + unit + ': not every day';
        }
        if (input.onceaday > 0) {
          if ( desc !== '' ) desc += ', ';
          unit = ( input.onceaday === 1 ) ? ' meat eater' : ' meat eaters';
          desc += input.onceaday + unit + ': once a day';
        }
        if (input.twiceaday > 0) {
          if (desc !== '') desc += ', ';
          unit = ( input.twiceaday === 1 ) ? ' meat eater' : ' meat eaters';
          desc += input.twiceaday + unit + ': twice a day';
        }
        if (input.everymeal > 0) {
          if (desc !== '') desc += ', ';
          unit = ( input.everymeal === 1 ) ? ' meat eater' : ' meat eaters';
          desc += input.everymeal + unit + ': every meal';
        }


        return desc;

      } else {
        return desc;
      }
    }

  };

});
