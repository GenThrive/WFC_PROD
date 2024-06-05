/*
* QuestionLogic: Household
*
* Household Question Logic.
*/

define(function( require ){

  var e = require('../../lib/WFCEvents');

  return {

    calc: function( report ) {
      report = report || {};
      var score = 0;
      report.message = 'Members:' + this.getHouseholdSize();
      return score;
    },

    util: function() {
      e.reqres.setHandler('household:size', this.getHouseholdSize, this);
      e.reqres.setHandler('household:plural', this.isPlural, this);
    },

    getHouseholdSize: function() {
      if ( this.get('input') ) {
        return this.get('input').numberOfPeople;
      } else {
        return 0;
      }
    },

    isPlural: function() {
      return this.get('input').numberOfPeople > 1;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var n = this.getHouseholdSize();
        var msg = n + ' household member';
        if (n > 1) {
          msg += 's';
        }

        return msg;

      } else {
        return desc;
      }
    }

  };

});
