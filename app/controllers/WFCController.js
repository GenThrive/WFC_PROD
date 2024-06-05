/*
* WFCController
* Controller for slide display related routes.
*/

define(function( require ){

  var e              = require('../lib/WFCEvents');
  var WelcomeView    = require('../views/WelcomeView');
  var QuestionView   = require('../views/QuestionView');
  var ProgressView   = require('../views/ProgressView');
  var ScoreView      = require('../views/ScoreView');
  var CompletionView = require('../views/CompletionView');
  var ReportView     = require('../views/ReportView');
  var HeaderView     = require('../views/HeaderView');

  var WFCController = Marionette.Controller.extend({

    nom : 'WFCController',

    initialize: function() {
      // Listen for cleard/reinitialized session:
      this.listenTo( e.vent, 'session:restart', this.restart, this);
      this.listenTo(e.vent, 'do:report', this.doReport, this);
      this.listenTo(e.vent, 'end:report', this.endReport, this);
    },

    entitle : function(title, url){
      document.title = title;
      // the goog
      ga("send", "pageview", {
        "page": url,
        "title": title
      });
    },

    assets: function() {
      // Create or confirm Questions and Topics.
      this.questions = this.questions || e.reqres.request('question:get:all');
      this.topics = this.topics || this.questions.getTopics();
    },

    welcome: function() {
      if(window.wfc_debug) console.log('route:welcome');

      this.assets();
      e.commands.execute('score:calculate');

      // Make sure unneeded views are closed:
      e.commands.execute("layout:close", "progress");
      e.commands.execute("layout:close", "report");

      // WelcomeView:
      // If no current score view, create and show.
      e.commands.execute('layout:show', 'content', new WelcomeView());

      // ScoreView:
      // If no current score view, create and show.
      var scoreView = e.reqres.request('layout:currentview', 'score');
      if ( !scoreView ) {
        scoreView = new ScoreView({ collection: this.questions });
        e.commands.execute('layout:show', 'score', scoreView);
      }
      scoreView.welcome();

      // HeaderView:
      var headerView = e.reqres.request('layout:currentview', 'header');
      if ( !headerView ) {
        headerView = new HeaderView();
        e.commands.execute('layout:show', 'header', headerView);
      }
      headerView.welcome();

      this.entitle('Welcome to the Water Footprint Calculator', "/");
    },

    question: function( slug ) {
      if(window.wfc_debug) console.log('route:question', slug);

      this.assets();
      var validation = this.topics.isRenderable( slug );

      if ( validation.valid ) {
        this.renderQuestion( slug );
      } else {
        e.commands.execute('route:go', validation.validSlug );
      }
    },

    renderQuestion: function( slug ) {

      this.assets();

      // Make sure unneeded views are closed:
      e.commands.execute("layout:close", "report");

      // QuestionView:
      // Locate question, create and show QuestionView.
      var question = this.questions.getQuestion( slug );
      // e.commands.execute("layout:show", "content", new QuestionView({ model: question }));
      e.commands.execute("layout:show:question", new QuestionView({ model: question }));

      // ScoreView:
      // If no current score view, create and show.
      var scoreView = e.reqres.request('layout:currentview', 'score');
      if ( !scoreView ) {
        scoreView = new ScoreView({ collection: this.questions });
        e.commands.execute('layout:show', 'score', scoreView);
      }
      scoreView.question();

      // ProgressView:
      // If no current progress view, create and show.
      var progressView = e.reqres.request('layout:currentview', 'progress');
      if ( !progressView ) {
        progressView = new ProgressView({ collection: this.topics });
        e.commands.execute('layout:show', 'progress', progressView);
      }
      $('#progress').removeClass('gone');

      // HeaderView:
      var headerView = e.reqres.request('layout:currentview', 'header');
      if ( !headerView ) {
        headerView = new HeaderView();
        e.commands.execute('layout:show', 'header', headerView);
      }
      headerView.question();

      // Page Dressing:
      this.entitle(question.get('topic'), "/q/"+ question.get("slug"));
    },

    complete: function() {
      if(window.wfc_debug) console.log('route:complete');


      this.assets();
      e.commands.execute('score:calculate');

      if ( this.topics.isComplete() ) {
        this.renderComplete();
      } else {
        e.commands.execute('route:go', '/');
      }

    },

    renderComplete: function() {

      this.assets();

      // ScoreView:
      // If no current score view, create and show.
      var scoreView = e.reqres.request('layout:currentview', 'score');
      if ( !scoreView ) {
        scoreView = new ScoreView({ collection: this.questions });
        e.commands.execute('layout:show', 'score', scoreView);
      }
      scoreView.complete();

      // ReportView:
      // If no current re;port view, create and show.
      var reportView = e.reqres.request('layout:currentview', 'report');
      if ( !reportView ) {
        reportView = new ReportView({ collection: this.topics });
        e.commands.execute('layout:show', 'report', reportView);
        reportView.setQuestionMode( false );
      }

      // HeaderView:
      var headerView = e.reqres.request('layout:currentview', 'header');
      if ( !headerView ) {
        headerView = new HeaderView();
        e.commands.execute('layout:show', 'header', headerView);
      }
      headerView.complete();

      e.commands.execute('layout:show', 'content', new CompletionView());
      e.commands.execute("layout:close", "progress");

      this.entitle('Your Water Footprint', "/complete");
    },

    restart: function() {
      delete this.topics;
      e.commands.execute('layout:close', 'score');
      e.commands.execute('layout:close', 'progress');
      e.commands.execute('route:go', '/q/' + this.questions.first().get('slug') + '/');
    },

    doReport: function( list ) {
      list = list || false;
      if(window.wfc_debug) console.log("Start Report.");

      // ReportView:
      // If no current re;port view, create and show.
      var reportView = e.reqres.request('layout:currentview', 'report');
      if ( !reportView ) {
        reportView = new ReportView({ collection: this.topics });
        e.commands.execute('layout:show', 'report', reportView);
      }
      reportView.doReport( list );
    },

    endReport: function() {
      if(window.wfc_debug) console.log("End Report.");

      // ProgressView:
      // If no current progress view, create and show.
      if ( !e.reqres.request('layout:currentview', 'progress') ) {
        e.commands.execute('layout:show', 'progress', new ProgressView({ collection: this.topics }));
      }
      e.commands.execute("layout:close", "report");
      // var headerView = e.reqres.request('layout:currentview', 'header');
      // if ( headerView ) {
        // headerView.report( false );
      // }
      var scoreView = e.reqres.request('layout:currentview', 'score');
      if ( scoreView ) {
        scoreView.question();
        scoreView.update();
      }
    }

  });

  return WFCController;

});
