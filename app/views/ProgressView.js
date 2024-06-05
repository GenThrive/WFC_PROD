/*
* Progress Bar View
*/

define(function( require ){

  require('marionette');
  var e        = require('../lib/WFCEvents');
  var template         = require('./templates/progress');
  var ProgressItemView = require('./ProgressItemView');
  var Topic            = require('../models/Topic');

  var ProgressView = Marionette.CompositeView.extend({

    nom               : 'ProgressView',
    id                : 'progress-ui',
    template          : template,
    itemView          : ProgressItemView,
    itemViewContainer : '#progress-nodes',
    

    events: function(){
      return this.translateEvents({
        'tap #start'         : 'goToWelcome',
        'tap #mobile-prompt' : 'mobileScore',
        'tap #finish'        : 'goToFinish'
      });
    },
    

    initialize: function() {
      _.bindAll(this);
    },

    goToWelcome: function(evt) {
      evt.stopPropagation();
      e.commands.execute('route:go', '');

      ga('send', 'event', {
        'eventCategory' : "Progress",
        'eventAction'   : "tap",
        'eventLabel'    : "Go to Welcome"
      });
    },

    goToFinish: function(evt) {
      evt.stopPropagation();
      if ( e.reqres.request('questions:complete') ) {
        e.commands.execute('route:go', '/complete/');
      }

      ga('send', 'event', {
        'eventCategory' : "Progress",
        'eventAction'   : "tap",
        'eventLabel'    : "Go to Finish"
      });
    },

    onRender: function() {
      // Wrap questions in divs based on group:
      var that = this,
          groups = this.collection.groupBy('group');

      // // For each group of questions....
      _.each( groups, function(g, i){
        // ...create a container div....
        var id = that.slugify( i );
        that.$(that.itemViewContainer).append('<div id="' + id + '" class="progress-group set"></div>');
        that.$( '#' + id ).append('<span class="progress-group-label">' + i + '</span>');
        // ...move the rendered itemviews into the corresponding container...
        _.each( g, function( m ){
          var container = '#' + that.slugify( m.get('group') );
          that.$(container).append( that.children.findByModel( m ).el );
        });
        that.$( '#' + id ).append('<div class="tri shadow"></div>');
        that.$( '#' + id ).append('<div class="tri"></div>');
      });
      // // ...and remove the origina container.
      this.$('#progress-nodes .progress-group').unwrap();

      this.collection.each(function(m){m.onQuestion();});

      this.$('.progress-group.set').mouseenter( this.onHover );
      this.$el.mouseleave( this.onExit );

      this.$('.progress-group.set').on('tap', this.tapExpose );

      this.$('#finish').toggleClass('active', e.reqres.request('questions:complete') );
    },

    tapExpose: function(evt) {
      evt.preventDefault();
      this.onHover(evt);
      // setTimeout(this.onExit, 4000);
    },

    onHover: function(evt) {
      this.$('.hover').removeClass('hover');
      $(evt.currentTarget).addClass('hover');
      this.$('.current.now').removeClass('now');
    },

    onExit: function() {
      this.$('.hover').removeClass('hover');
      this.$('.current').addClass('now');
    },

    slugify: function(s) {
      // Even though no question should be without a "group", I would rather the
      // UI not go completely batshit crazy if one or more is undefined.
      if (s !== 'undefined' && s !== undefined) {
        return s.toLowerCase().replace(/ /g, '-');
      } else {
        return 'uncategorized';
      }
    },

    mobileScore: function() {
      e.commands.execute('mobile:score:show');

      ga('send', 'event', {
        'eventCategory' : "Progress",
        'eventAction'   : "tap",
        'eventLabel'    : "Mobile Score"
      });
      window.scroll(0,100);
    }

  });

  return ProgressView;
});
