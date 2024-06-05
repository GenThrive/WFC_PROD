/*
* Topic
* Topic Model: Measured answeredness on a topic level.
*/

define(function( require ){

  require('backbone');
  var e = require('../lib/WFCEvents');
  var env = require("../environment");

  var Topic = Backbone.Model.extend({
    nom: "Topic",
    initialize: function(){
      _.bindAll(this, ['bindToQuestionStatus', 'bindToQuestionUpdate']);
      _.each(this.get('questions'), this.bindToQuestionStatus);
      _.each(this.get('questions'), this.bindToQuestionUpdate);
      this.listenTo(e.vent, 'question:start', this.onQuestion, this);
    },

    bindToQuestionStatus: function( question ) {
      this.onQuestionStatus(question);
      this.listenTo(question, 'change:answered', this.onQuestionStatus, this);
    },

    onQuestionStatus: function(question) {
      var some = _.some(this.get('questions'), function(question){
        return question.get('answered') !== undefined;
      });
      var every = _.every(this.get('questions'), function(question){
        return question.get('answered') === true;
      });
      if (some && !every) {
        this.set('answered', false);
      }
      if (every) {
        this.set('answered', true);
      }
    },

    // Passes the description into each describe method for decoration
    describe: function() {
      var description = '';
      _.each(this.get('questions'), function(q){
        if( q.describe ) description = q.describe(description);
      });
      return description;
    },

    getTopicIcon: function() {
      var ico = this.get('topicIcon');
      if (ico) {
        var root = env.appRoot;
        ico = ico.replace(/^\/|\/$/g, '');
        return root + ico;
      } else {
        return undefined;
      }
    },
    
    isComplete: function() {
      return _.every(this.get('questions'), function(q){
        return q.get('answered') === true;
      });
    },

    bindToQuestionUpdate: function( question ) {
      this.listenTo(question, 'change:input', this.onQuestionUpdate, this);
    },

    onQuestionUpdate: function() {
      this.trigger('score:update');
    },

    onQuestion: function() {
      var that = this;
      _.each( this.get('questions'), function(question){
        if ( window.location.href.indexOf( question.get('slug') ) !== -1) {
          that.trigger('question:current');
        }
      });
    },

    getTopicAverage: function() {
      // console.log("Average:", this.get('topic'), this.get('scalable'));
      var average = 0;
      _.each( this.get('questions'), function(q){
        var a = q.get('question').nationalAverage;
        if (a) {
          average += a;
        }
      });
      // console.log("Initial: ", average);
      if( this.get('scalable') ) {
        var m = e.reqres.request('household:size');
        // console.log("Scaling by", m);
        average = average * m;
      }
      // console.log("Final: ", average);
      return Math.round(average);
    },

    getTopicScore: function() {
      var score = 0;
      _.each( this.get('questions'), function(q){
        var s = q.calc();
        if (s) {
          score += s;
        }
      });
      return Math.round( score );
    },

    getTipsLink: function() {
      //language awarenesss   
      var userLang = e.reqres.request('session:get').userLang;
      var linkurl = 'link'+userLang;

      var linked = _.find( this.get('questions'), function(q){
        return q.get('question')[linkurl] !== undefined;
      });
      if (linked) {
        return linked.get('question')[linkurl];
      } else {
        return '';
      }
    },

    getSlug: function() {
      return this.get('topic').toLowerCase().replace(/ /g, '-').replace('&', 'and').replace('.', '').replace('!', '');
    }

  });

  return Topic;

});
