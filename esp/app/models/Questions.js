/*
* Questions
* Collection of questions monitored by the system.
*/

define(function( require ){

  require('localstorage');
  var e          = require('../lib/WFCEvents');
  var Collection = require('./Collection');
  var Question   = require("./Question");
  var Topic      = require('../models/Topic');
  var Topics     = require('../models/Topics');
  var env        = require("../environment");

  var Questions = Collection.extend({

    nom: "Questions",
    model: Question,
    localStorage: new Backbone.LocalStorage("WFCQuestionsESP"),

    initialize: function(){
      var deferred = $.Deferred();
      this.bindEventHandlers();
      _.bindAll(this);

      // Listens for logic module installations.
      this.listenTo( this, 'logic:installed', this.onLogicInstalled, this);

      // When a question's recorded input changes, re-calculate the score.
      this.listenTo( this, 'change:input', this.calcAll, this);
    },

    // Fetch data from localStorage.
    fetchLocalData: function(){
      this.fetch({ complete: this.fetchJSONData });
    },

    // Fetch JSON data.
    fetchJSONData: function(){
      Backbone.ajaxSync('read', this, {
        url: env.appRoot + 'data/wfc-questions.json',
        success: this.onQuestionData
      });
    },

    // Merge JSON data with localStorage data. If first
    // session, seeds the localStorage data and saves.
    onQuestionData: function( resp ) {
      this.set(resp);
      this.saveAll();
    },

    // When all models have initialized and installed their custom
    // logic modules, this should pass it's test and fire session:ready.
    onLogicInstalled: function() {
      // Checks for any models with un-loaded logic:
      var test = this.find(function(m){
        return m.calc === undefined;
      });
      // If all are loaded, session is ready:
      if (!test) {
        e.vent.trigger('session:ready');
      }
    },

    // Calculates total score by invoking every question's calc() method.
    // MOST of the code here is for debugging (report).
    calcAll: function() {
      var report = {};
      var score = 0;

      this.each(function(m, i){
        if (m.calc) {
          var r = report[ i + ':' + m.get('topic') + ':' + m.get('slug') ] = {};

          var calc = m.calc(r);
          score += Number( calc );

          if ( m.get('input') ) r.input = m.get('input');
          r[ '+' ] = Number( calc );
          r[ '=' ] = score;
        }
      });

      e.vent.trigger('score:update', score);
      this.currentScore = score;

      if (window.wfc_debug) {
        console.log( 'Report:', report );
      }
    },

    // Special calc-run for getting score using household size.
    // Issues empty, throw-away report object to calc() methods,
    // which issues permission to use household size in math.
    calcAllHouseousehold: function() {
      var score = 0;
      this.each(function(m, i){
        score += m.calc({household:true});
      });
      return score;
    },

    // GETTERS:
    // Hooks for getting questions and question data.
    bindEventHandlers: function(){
      e.reqres.setHandler('question:get', this.getQuestion, this);
      e.reqres.setHandler('question:get:all', this.getQuestions, this);
      e.reqres.setHandler("question:get:first", this.getFirstQuestion, this);
      e.reqres.setHandler("question:get:next", this.getNextQuestion, this);
      e.reqres.setHandler("question:get:prev", this.getPrevQuestion, this);
      e.reqres.setHandler("score:current", this.getCurrentScore, this);
      e.reqres.setHandler("score:current:formatted", this.getCurrentScoreFormatted, this);
      e.reqres.setHandler('score:household', this.calcAllHouseousehold, this);
      e.commands.setHandler('score:calculate', this.calcAll, this);
    },

    getCurrentScore: function() {
      if (!this.currentScore) {
        this.calcAll();
      }
      return Math.round( Number(this.currentScore) );
    },


    getCurrentScoreFormatted: function(){
      // if(!this.currentScore) this.calcAll();
      return this.getCurrentScore().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },


    getTopics: function() {
      //language awareness
      var userLang = e.reqres.request('session:get').userLang;
      
      var questionTopics = this.groupBy('topic');
      var topics = [];
      _.each( questionTopics, function(qt, i){
        topics.push( new Topic({
          topic: i,
          topicText: _.first(qt).get('topic'+userLang),
          topicIcon: _.first(qt).get('topicIcon'),
          group: _.first(qt).get('group'),
          groupText: _.first(qt).get('group'+userLang),
          hidden: _.first(qt).get('topicHidden'),
          scalable: _.first(qt).get('topicScalable'),
          questions: qt
        }));
      });
      return new Topics( topics );

    },

    getPrevQuestion: function(question){
      var prevIndex = question.id - 1;
      if(prevIndex < 0) prevIndex = 0;
      return this.models[prevIndex];
    },

    getNextQuestion: function(question){
      var nextIndex = question.id + 1;
      if(nextIndex > this.models.length - 1) nextIndex = this.models.length - 1;
      return this.models[nextIndex];
    },

    // simply return the first quiz question (regardless of session or isAnswered status)
    getFirstQuestion: function(){
      return this.models[0];
    },

    // get the first unanswered question in the quiz
    getFirstUnansweredQuestion: function(){
      // maybe unnecessary, but I'm applying a sort in the event that the json data is not ordered
      var first = _.sortBy(_.where(this.models, { isAnswered: false }), function(q){ return q.id; })[0];
      return first;
    },

    // Reurns Question By Slug
    getQuestion: function(slug){
      return this.find(function(m){
        return m.get('slug') === slug;
      });
    },

    // Returns the Questions collection
    getQuestions: function(slug){
      return this;
    }

  });
  return Questions;
});
