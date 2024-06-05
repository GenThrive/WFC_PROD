/*
* ScoreView
* Score Display (Water Level)
*/

define(function( require ){

  require('marionette');
  var e        = require('../lib/WFCEvents');
  var template = require('./templates/score');
  var Wave     = require('./ui/Wave');

  var ScoreView = Marionette.ItemView.extend({

    nom: 'ScoreView',
    template: template,
    id: 'score-ui',


    events: function(){
      return this.translateEvents({
        'tap #score-graph': 'showGraph',
        'tap #score-table': 'showTable'
      });
    },


    initialize: function() {
      _.bindAll(this, ['complete']);
      this.listenTo(e.vent, 'question:start', this.update, this);
      this.listenTo( e.vent, 'score:update', this.renderScore, this );
      e.commands.setHandler('mobile:score:show', this.showDetails, this);
    },

    onShow: function() {
      this.waveBack = new Wave();
      this.waveBack.initialize( this.$('#water-surface-one')[0], '#a5dad8' );

      this.waveFront = new Wave();
      this.waveFront.initialize( this.$('#water-surface-two')[0], '#a8dcfb' );

      this.update();
    },

    update: function() {
      e.commands.execute('score:calculate');
    },

    renderScore: function( score ) {
      this.$('#score-value').text( this.numberWithCommas( Math.round(score) ) );

      // Hides score info if zero.
      this.$('#score-display').toggleClass('hidden', score === 0);
      this.$('#score-display').removeClass('complete');

      // Ceiling scaled for household size: DEPRICATED
      // var h = e.reqres.request('household:size');
      // $('#meter').css({'background-position': '0 ' + (h * 20) + '%'});
      // var ceiling = 2112 * (h * 1);

      // Highest imaginable sore (would hit top of screen);
      var ceiling = 2112;

      // Limits actual water position between 10% and 90% so the water doesn't go out of view.
      var p = Math.max( Math.min( (score/ceiling) * 100, 90), 10);
      this.fillTo(p);

      //language awareness
      var userLang = e.reqres.request('session:get').userLang;
      
      // Update current household score 
      if ( e.reqres.request('household:size') > 1 ) {
        $('.household-score').show();
        if (userLang === "ESP") {
          this.$('.household-score').html( '<span class="tag">Hogar: </span><span class="value">' + this.numberWithCommas( Math.round( e.reqres.request('score:household') ) ) + '<span class="units">Galones/Día</span></span>');
        } else {
          this.$('.household-score').html( '<span class="tag">Household: </span><span class="value">' + this.numberWithCommas( Math.round( e.reqres.request('score:household') ) ) + ' <span class="units">Gallons/Day</span></span>');
        }  
      } else {
        $('.household-score').hide();
        this.$('.household-score').empty();
      }
    },

    fillTo: function(level) {

      $('#score-display').toggleClass('pushup', level < 20);

      var under = 100 - level;

      // Positions water and score.
      this.$('#water').css({ top: under + '%' });
      this.$('#score-display').css({ top: under + '%' });
      this.$('#volume').css({ height: level + '%' });

      // Agitates the water.
      // TODO: Don't do this unless a substantial change is detected?
      this.waveBack.twitch();
      this.waveFront.twitch();
    },

    welcome: function( level ) {
      this.$('#score-display').addClass('hidden');
      this.$('#score-display').removeClass('complete');
      this.fillTo(40);
    },

    question: function() {
      this.$('#score-display').css({width: 'auto'});
      this.$('#score-display').removeClass('complete');
    },

    complete: function( level ) {
      this.$('#score-display').addClass('complete');
      // this.$('#score-display').css({ width: this.$('#score-value').outerWwidth() });
      this.fillTo(70);
    },

    numberWithCommas: function (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    showDetails: function(evt) {
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      setTimeout(this.complete, 333);
      e.vent.trigger('do:report');
    },

    showGraph: function(evt) {
      // console.log("Show Graph.");
      evt.stopPropagation();
      evt.preventDefault();
      setTimeout(this.complete, 333);
      e.vent.trigger('do:report', false);

      $('html,body').animate({
               scrollTop: $('#report-graph').offset().top
      }, 1200);

      ga('send', 'event', {
        'eventCategory': "Score",
        'eventAction': "tap",
        'eventLabel': "Show Graph"
      });
    },

    showTable: function(evt) {
      // console.log("Show Table.");
      evt.stopPropagation();
      evt.preventDefault();
      setTimeout(this.complete, 333);
      e.vent.trigger('do:report', true);

      $('html,body').animate({
               scrollTop: $('#report-table').offset().top
      }, 1200);

      ga('send', 'event', {
        'eventCategory': "Score",
        'eventAction': "tap",
        'eventLabel': "Show Table"
      });
    }

  });

  return ScoreView;

});
