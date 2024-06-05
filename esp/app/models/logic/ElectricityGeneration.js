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
        var s = e.reqres.request('score:get:electricity-state');
        var p = Number( input.precentUtility/100 );

        score = - s + ( p * s );
        //mpg : updated score to reflect household number (added * m)
        score = score * m;

        report.message = '- State Value: ' + s + ' + (Percent Utility:' + p + ' * State Value:' + s + ')';
      } else {
        report.message = 'No recorded inputs.';
      }

      return score;
    },

    describe: function( desc ) {
      var input = this.get('input');
      if (input) {

        var pU = Math.round(input.precentUtility/10) * 10;
        
        //language awareness
        var userLang = e.reqres.request('session:get').userLang;
        if (userLang === "ESP") {
          return desc + ', ' + pU + '% energía de la red de servicio público, ' + (100 - pU) + '% energía renovable';
        } else {
          return desc + ', ' + pU + '% utility power, ' + (100 - pU) + '% renewable power';
        }  

      } else {
        return desc;
      }
    }

  };

});
