/*
*
* Maybe there is a good reason to have a super class for question views?
* I'm assuming there is, but whether a particular question should inherit from
* a composite view (or some other marionette view construct) instead of this item
* view is a question I can't answer at the moment.. I guess we'll find out.
*
*/

define(function(require){

  require("marionette");
  var e        = require("../lib/WFCEvents");
  var env      = require("../environment");
  var template = require("./templates/question");

  // Question UI Views (Required for Bundler)
  require('./questions/BathroomSinkDuration');
  require('./questions/BathroomSinkFlow');
  require('./questions/Baths');
  require('./questions/Cars');
  require('./questions/Carwashing');
  require('./questions/DietDistribution');
  require('./questions/DietMeatServings');
  require('./questions/Dishes');
  require('./questions/Driving');
  require('./questions/ElectricityGeneration');
  require('./questions/ElectricityState');
  require('./questions/GreywaterSystem');
  require('./questions/Household');
  require('./questions/KitchenSinkDuration');
  require('./questions/KitchenSinkFlow');
  require('./questions/Laundry');
  require('./questions/LawnAndGarden');
  require('./questions/LawnAndGardenArea');
  require('./questions/LawnAndGardenXeriscape');
  require('./questions/LearnedTheMostAbout');
  require('./questions/MostInterestedIn');
  require('./questions/PetFood');
  require('./questions/QuestionUIView');
  require('./questions/RainBarrel');
  require('./questions/Fabrics');
  require('./questions/RecyclingMetalAndGlass');
  require('./questions/Paper');
  require('./questions/Plastic');
  require('./questions/ShoppingHabits');
  require('./questions/ShowerDuration');
  require('./questions/ShowerFlow');
  require('./questions/SwimmingPool');
  require('./questions/SwimmingPoolUse');
  require('./questions/ToiletFlow');
  require('./questions/ToiletMellow');
  require('./questions/VirtualWaterUse');

  return Marionette.ItemView.extend({

    nom: "QuestionView",
    template: template,
    className: 'question-ui',


    events: function(){
      return this.translateEvents({
        'tap .help-toggle': 'toggleHelp'
      });
    },


    initialize: function() {
      _.bindAll(this);
      this.model.onStart();
    },

    serializeData: function() {
      return _.extend(this.model.attributes, {
        text: this.model.getQuestionText(),
        art: this.model.getQuestionArt(),
        icon: this.model.getTopicIcon()
      });
    },

    // When question renders, locate, require and render the input interface itself.
    onRender: function() {
      // Speculates custom interface view module path based on slug
      var viewPath = './questions/' + this.model.getPascalCaseSlug();
      // Uses async-style require syntax to load interface view module.
      require([viewPath], this.renderUI, this.renderGenericUI);

      /* Question status:
        'answered' === undefined : untouched
        'answered' === false     : in progress
        'answered' === true      : complete
      */
      if ( !this.model.get('answered') ) {
        this.model.save({'answered': false});
      }
      e.vent.trigger('question:start');

      $(window).resize(this.positionVertical);
      this.positionVertical();
    },

    // setArt: function() {
    //   this.$('.quesetion-art').removeClass('hidden');
    //   var h = $(window).height() - $('#progress-ui').height();
    //   var w = $(window).width() <= 480;
    //   this.$('.quesetion-art').toggleClass('hidden', h < this.$el.height() );
    // },

    positionVertical: function() {
      // this.setArt();

      var h = $(window).height() - $('#progress-ui').height();

      if (h > this.$el.height()) {
        this.$el.addClass('vertical');
        this.$el.css({ top: Math.max(h/2, 20) });
      } else {
        this.$el.removeClass('vertical');
        this.$el.css({ top: 0 });
      }

    },


    renderUI: function( Interface ) {
      // Creates interface view module instance and renders.
      this.interface = new Interface({ model: this.model });
      this.$('#question-interface').html( this.interface.render().el );
      this.listenTo( this.interface, 'complete', this.navigateNext, this );
      this.listenTo( this.interface, 'navigate:prev', this.navigatePrev, this );
      this.positionVertical();
    },


    renderGenericUI: function( err ) {
      // If custom interface view module isn't found, replaces with generic.
      if(window.wfc_debug) console.log("Question View: Rendering Generic UI", err);
      requirejs.undef( err.requireModules && err.requireModules[0] );
      require(["./questions/QuestionUIView"], this.renderUI);

    },


    // Cleanup Question UI bindings etc. Could be avoided if we used a
    // Martionette Layoute.Region instead of hand-nesting the view.
    onBeforeClose: function() {
      $('#progress #mobile-prompt').removeClass('hidden');
      this.interface.close();
      // Anything else? THIS view's stopListening will be
      // called/cleaned when Marionette removes it. It's more
      // about promting the hand-nested interface view to clean up,
      // and I think this is all it takes.
    },


    // next question please.
    // GA is tracked in the QuestionUIView that tosses these events to this view
    navigateNext: function(){
      var nextQuestion = e.reqres.request("question:get:forward", this.model);
      if (nextQuestion) {
        e.commands.execute('route:go', nextQuestion.getRoute() );
      } else {
        e.commands.execute('route:go', 'complete/' );
      }
    },


    // previous question please.
    // GA is tracked in the QuestionUIView that tosses these events to this view
    navigatePrev: function(){
      var prevQuestion = e.reqres.request("question:get:backward", this.model);
      e.commands.execute('route:go', prevQuestion.getRoute() );
    },

    toggleHelp: function() {
      this.$('#question-help').toggleClass('active');
      $('#progress #mobile-prompt').toggleClass('hidden');
      var h = Math.max($('#content > .question-ui').height() + 42, $(window).height());
      this.$('#question-help').height( h );

      ga('send', 'event', {
        'eventCategory': "Question",
        'eventAction': "tap",
        'eventLabel': "Toggle Help"
      });
    }

  });
});

