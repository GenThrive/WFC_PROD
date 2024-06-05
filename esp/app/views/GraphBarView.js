/*
* GraphBarView
* Score graph and list report.
*/

define(function( require ){

  require('marionette');
  require('scrollto');
  var template = require('./templates/graph-bar');

  var GraphBarView = Marionette.ItemView.extend({

    nom: 'GraphBarView',
    template: template,
    gaEventCategory: "Graph Bar",
    className: 'graph-bar',
    id: function() {
      return this.model.getSlug();
    },
    

    events: function(){
      return this.translateEvents({
        'tap': 'onBarClick'
      });
    },
    

    initialize: function() {
      this.listenTo( this.model, 'score:update', this.render, this);
    },

    onRender: function() {
      this.$el.addClass( this.model.get('group').toLowerCase().replace(/ /g, '-') );
      this.$el.toggleClass('hidden', this.model.get('hidden') === true );
    },

    serializeData: function() {
      return _.extend(this.model.attributes, {
        score: this.model.getTopicScore()
      });
    },

    drawBar: function(w, maxH, maxD, i) {
      bounds = this.getBounds(maxH, maxD);
      if( !this.model.get('hidden') ) {
        this.$el.css({
          width: w + '%',
          left: (w * i) + '%',
          height: bounds.height,
          bottom: bounds.bottom
        });
      }
    },

    getBounds: function( maxH, maxD ) {
      var bounds = {};
      var score = this.model.getTopicScore();
      var highestScore = this.model.collection.getHighestTopicScore();
      if (score >= 0) {
        bounds.height = ((score/highestScore) * maxH );
        bounds.height = Math.max(bounds.height, 2);
        bounds.bottom = maxD;
      } else {
        this.$el.addClass('negative');
        var unit = maxH / highestScore;

        // Old - simply let the lowest score define the tallest negative bar:
        // var lowestScore = this.model.collection.getLowestTopicScore();
        // bounds.height = ((score/lowestScore) * maxD * 0.8 );

        bounds.height = Math.min(Math.abs(score * unit), maxD * 0.8);

        bounds.height = Math.max(bounds.height, 4);
        bounds.bottom = Math.min(maxD - parseInt(bounds.height), maxD - 4);
      }
      return bounds;
    },

    onBarClick: function(evt) {
      var el = $( '#report-' + this.model.getSlug() );
      var label = evt.currentTarget.innerText;
      
      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': label
      });

      $.scrollTo(el.offset().top - 174, 666);
    }

  });

  return GraphBarView;

});
