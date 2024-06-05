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
      
      //highest water consumption value for meat used to set the water level at its highest as soon as the user lands on the DietMeatServings question
      //this is also hard coded into DietMeatServings.js
      var max_meat_usage = 1283;

      if ( input ) {

        score = (input.vegans * 406) + (input.vegetarians * 563) + (this.getNumMeatEaters() * max_meat_usage);
        report.message = '(Vegans: ' + input.vegans + ' * 406) + (Vegetarians: ' + input.vegetarians + ' * 563) + (Meat: ' + this.getNumMeatEaters() + ' * '+ max_meat_usage +' )';
          
        if(!report.household && score > 0) {
          report.message += ' / ' +(input.vegans + input.vegetarians) + ' total non-meat-eaters, to average.';
          score = score/(input.vegans + input.vegetarians + this.getNumMeatEaters());
          // console.log("Diet Distribution:", score, report.message);
        }

        this.getTopic().set({closed: this.getNumMeatEaters() === 0 }); 

      } else {
        report.message = 'No recorded inputs.'; 
      }


      return score;
    },

    util: function() {
      e.reqres.setHandler('diet:meat-eaters', this.getNumMeatEaters, this);
    },

    getNumMeatEaters: function() {
      if ( this.get('input') ) {
        return this.get('input')[ 'meat-eaters' ];
      } else {
        return 0;
      }
    },

    progressValidation: function() {
      var input = this.get('input');
      var total = 0;
      var house;

      if (input) {
        house = e.reqres.request('household:size');
        total = input.vegans + input.vegetarians + input[ 'meat-eaters' ];
        
      }

      return input && total === house;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var s = '';
        //language awareness
        var userLang = e.reqres.request('session:get').userLang;
        if (userLang === "ESP") {
            if (input.vegans > 0) {
              s += input.vegans + ' vegana';
              if (input.vegans > 1) s += 's';
            }
            if (input.vegetarians > 0) {
              if (s !== '') s += ', ';
              s += input.vegetarians + ' vegetariana';
              if (input.vegetarians > 1) s += 's';
            }
        } else {
            if (input.vegans > 0) {
              s += input.vegans + ' vegan';
              if (input.vegans > 1) s += 's';
            }
            if (input.vegetarians > 0) {
              if (s !== '') s += ', ';
              s += input.vegetarians + ' vegetarian';
              if (input.vegetarians > 1) s += 's';
            }
        }    
        return s;

      } else {
        return desc;
      }
    }

  };

});
