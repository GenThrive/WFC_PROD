/*
* GraphView
* Score graph and list report.
*/

define(function( require ){

  require('marionette');
  var template = require('./templates/graph');
  var GraphBar = require('./GraphBarView');

  var GraphView = Marionette.CompositeView.extend({

    nom: 'GraphView',
    id: 'graph-ui',
    template: template,
    itemView: GraphBar,
    itemViewContainer: '.graph-bars',

    initialize: function() {
      _.bindAll(this, ['drawBars']);
      this.listenTo( this.collection, 'score:update', this.render, this);
    },

    onRender: function() {
      setTimeout(this.drawBars, 0);
      $(window).resize( this.drawBars );
    },

    drawBars: function() {
      var visibleBars = this.collection.filter( function(m){
        return m.get('hidden') === undefined && m.get('topic') !== 'Household';
      });

      // General Dimensions
      var barWidth = 100/visibleBars.length;
      var barMaxDepth = this.$('.graph-depth').outerHeight() - 20;
      var barMaxHeight = this.$('.graph-bars').outerHeight() - barMaxDepth;

      var that = this;
      _.each( visibleBars, function(m, i){
        that.children.findByModel(m).drawBar( barWidth, barMaxHeight, barMaxDepth, i );
      });
    }

  });

  return GraphView;

});
