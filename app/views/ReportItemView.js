/*
* ReportItemView
* Individual topic item for report list.
*/

define(function( require ){

  require('marionette');
  var template = require("./templates/report-item");
  var e        = require("../lib/WFCEvents");

  var ReportItemView = Marionette.ItemView.extend({

    nom: 'ReportItemView',
    template: template,
    className: 'report-item',
    id : function() {
      return 'report-' + this.model.getSlug();
    },


    events: function(){
      return this.translateEvents({
        'tap .edit-item' : 'edit',
        'tap .row1': 'edit'
      });
    },


    initialize: function() {
      this.listenTo( this.model, 'score:update', this.render, this);
    },

    serializeData: function() {
      return _.extend( this.model.attributes, {
        score: this.model.getTopicScore(),
        average: this.model.getTopicAverage(),
        link: this.model.getTipsLink(),
        description: this.model.describe(),
        icon: this.model.getTopicIcon()
      });
    },

    onRender: function() {
      // console.log(this.model.get('topic'), this.model.get('hidden'), this.model.get('answered'), this.model.getTopicScore());
      this.$el.toggleClass('hidden', this.model.get('hidden') === true || this.model.get('answered') === undefined );
    },

    edit: function() {
      // Note: This is still firing for answered "dead" questions.
      if ( this.model.get('answered') !== undefined ) {
        $(window).scrollTo(0, 666);
        e.commands.execute('route:go', '/q/'+ this.model.get('questions')[0].get('slug') +'/');
      }

      ga('send', 'event', {
        'eventCategory': "Report",
        'eventAction': "tap",
        'eventLabel': "Revisit/Edit Question"
      });
    }

  });

  return ReportItemView;

});
