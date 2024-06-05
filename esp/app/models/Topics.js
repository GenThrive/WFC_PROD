/*
* Topics
* Collection of question topics, spawened by main Questions collection.
* Main responsibility is navigation, since progress is managed and
* displayed on by topic.
*/

define(function( require ){

  require('backbone');
  var e     = require('../lib/WFCEvents');
  var Topic = require("./Topic");

  var Topics = Backbone.Collection.extend({

    nom: "Topics",
    model: Topic,

    initialize: function() {
      e.reqres.setHandler('topic:get', this.getTopic, this);
      e.reqres.setHandler("question:get:forward", this.getNextOpenQuestion, this);
      e.reqres.setHandler("question:get:backward", this.getPrevOpenQuestion, this);
      e.reqres.setHandler("question:get:start", this.getStartingPoint, this);
      e.reqres.setHandler("questions:complete", this.isComplete, this);
    },

    getTopic: function( topic ) {
      return this.find(function(m){
        return m.get('topic') === topic;
      });
    },

    // For welcome screen ONLY:
    getStartingPoint: function() {
      var questions = e.reqres.request('question:get:all');

      // Get the last seen OR last completed quesiton.
      var lastComplete = _.findLast(questions.models, function(q){
        return q.get('answered') === true;
      });
      var firstPartial = questions.find( function(q){
        return q.get('answered') === false;
      });
      var lastTouched = firstPartial || lastComplete;

      // Check for completion:
      var completed = this.isComplete();

      // If no touched question or completion, default to first question.
      if (lastTouched === undefined & !completed) {
        lastTouched = questions.first();
      }

      // Return the last touched question,
      // whether or not it's first, and
      // whether or not the quiz is complete.
      return {
        question: lastTouched,
        isFirst: questions.indexOf(lastTouched) === 0,
        isComplete: completed
      };
    },

    isRenderable: function( slug ) {
      var valid = false;
      var validSlug = '/';
      var questions = e.reqres.request('question:get:all');
      var question = questions.getQuestion(slug);
      var qIndex = questions.indexOf(question);

      if ( question.get('answered') !== undefined) {
        valid = true;
        validSlug = '/q/' + question.get('slug') +'/';
      } else {
        // Get the last fully answered question:
        var lastComplete = _.findLast(questions.models, function(q){
         if (q.get('answered') === false && questions.indexOf(q) === 0) {
              window.location = '//www.watercalculator.org/';
          }
          return q.get('answered') === true && questions.indexOf(q) <= qIndex;
        });
        // Get the next open question:
        if (lastComplete) lastComplete.calc(); // Runs calculation silently to determine if topic is closed...
        var nextOpen = this.getNextOpenQuestion( lastComplete );

        valid = question === nextOpen;
        validSlug = '/q/' + nextOpen.get('slug') +'/';
      }

      return {
        valid: valid,
        validSlug: validSlug
      };
    },

    isComplete: function() {
      var complete = true;
      this.each(function(topic){
        if( !topic.get('closed') && !topic.isComplete() ) {
          complete = false;
        }
      });
      return complete;
    },

    getNextOpenQuestion: function( question ) {

      // Loops through questions above current question, testing each.

      var that = this;
      var questions = e.reqres.request('question:get:all');
      var nextQuestion = questions.find( function( q ){
        return questions.indexOf(q) > questions.indexOf(question) && that.testQuestion(q);
      });

      return nextQuestion;

    },

    getPrevOpenQuestion: function( question ) {

      // The find() command is tailored to read the colleciton in reverse.

      var that = this;
      var questions = e.reqres.request('question:get:all');
      var previousQuestion = _.find( questions.last(questions.length).reverse(), function( q ){
        return questions.indexOf(q) < questions.indexOf(question) && that.testQuestion(q);
      });

      return previousQuestion;

    },

    testQuestion: function( question ) {

      // A valid quesion is any who's topic is not closed,
      // OR is the first question in a closed topic which
      // contains more than one question in total.

      // A closed topic containing only one quesiton must have
      // been closed by a foreign question, eg. Cars -> Driving.
      // Otherwise, we're returning the user to the first question
      // in the topic which is ALWAYS the opener/closer.

      var valid = false;
      var topic = question.getTopic();
      var topicQuestions = topic.get('questions');
      if ( topic.get('closed') ) {
        if ( topicQuestions[0] === question ) {
          if ( topicQuestions.length > 1 ) {
            valid = true;
          }
        }
      } else {
        valid = true;
      }
      return valid;
    },

    getHighestTopicScore: function() {
      var highScore = 0;
      this.each(function(t){
        var score = t.getTopicScore();
        if (score > highScore) {
          highScore = score;
        }
      });
      return highScore;
    },

    getLowestTopicScore: function() {
      var lowScore = 0;
      this.each(function(t){
        var score = t.getTopicScore();
        if (score < lowScore) {
          lowScore = score;
        }
      });
      return lowScore;
    }

  });

  return Topics;

});
