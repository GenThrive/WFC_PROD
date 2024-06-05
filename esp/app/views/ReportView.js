/*
* ReportView
* Score graph and list report.
*/

define(function( require ){

  require('marionette');
  var template   = require('./templates/report');
  var GraphView  = require('./GraphView');
  var ReportItem = require('./ReportItemView');
  var env        = require("../environment");
  var e          = require("../lib/WFCEvents");

  var ReportView = Marionette.CompositeView.extend({

    nom: 'ReportView',
    template: template,
    itemView: ReportItem,
    itemViewContainer: '#report-list',
    id: 'report-ui',

    events: function(){
      return this.translateEvents({
        'click #email-submit1': 'submitEmail1',
        'click #email-submit2': 'submitEmail2'
      });
    },

    transitioning: false,

    initialize: function() {
      _.bindAll(this, ['makeWay', 'graphResize']);
    },

    serializeData: function() {
      return {
        score: e.reqres.request("score:current:formatted")
      };
    },

    onRender: function() {

      // REPORT CHART
      this.graph = new GraphView({ collection: this.collection });
      this.$('#report-graph').html( this.graph.render().el );

      // REPORT LIST
      // Wrap questions in divs based on group:
      var that = this,
          groups = this.collection.groupBy('group');

      // // For each group of questions....
      _.each( groups, function(g, i){

        groupLabel = _.first(g).get('groupText');

        // ...create a header div....
        var id = that.slugify( i );
        that.$(that.itemViewContainer).append('<div id="' + id + '-header" class="report-group"></div>');
        that.$( '#' + id + '-header' ).append('<span class="report-group-label">' + groupLabel + '</span>');
        // ...move the rendered itemviews into the corresponding header...
        _.each( g.reverse(), function( m ){
          var header = '#' + that.slugify( m.get('group') + '-header' );
          that.$(header).after( that.children.findByModel( m ).el );
        });
      });
      // // ...and remove the origina header.
      this.$('#progress-nodes .progress-group').unwrap();

      $(window).scroll( this.makeWay );
      $(window).scrollTo(0);

      $(window).resize( this.graphResize );
      this.graphResize();
    },

    initTransition: function() {
      this.transitioning = true;
    },

    setQuestionMode: function( val ) {
      this.questionMode = val;
    },

    doReport: function( list ){
      this.questionMode = true;
      this.transitioning = true;
      if (list) {
        $(window).scrollTo( $("#report-list"), 666);
      } else {
        $(window).scrollTo( $(window).height() * 0.7, 666);
      }
      var that = this;
      setTimeout(function(){
        that.transitioning = false;
      }, 1000);
    },

    makeWay: function(evt) {

      scr = $(window).scrollTop();

      // Actually have to take into account that the content region COULD
      // be taller than the viewport (mobile completion) and factor that
      // into the value that is currently just 40

      var contentDepth = 40;
      var $completion = $('#ui-completion');
      if ( $completion.length ) {
        contentDepth = $completion.offset().top + $completion.height() - $(window).height() + 40;
      }
      // console.log(contentDepth);

      $('#content').toggleClass('gone', scr > contentDepth );
      $('#progress').toggleClass('gone', scr > contentDepth );
      $('#ui-header').toggleClass('report', scr > contentDepth );
      $('#score-display').toggleClass('report', scr > contentDepth );

      var reportDepth = $('#report').offset().top - ($(window).height() * 0.3);

      if ( scr > reportDepth ) {
        $('#score-ui').css({top: -(scr - reportDepth) });
      } else {
        $('#score-ui').css({top: '0'});
      }


      var listDepth = $('#report-table').offset().top;
      $('#ui-header').toggleClass('report-scroll', scr > listDepth );
      $('#report-table').toggleClass('traveling', scr > listDepth );

      // Detect a return to the top of the screen:
      if (this.questionMode && !this.transitioning && scr === 0) {
        e.vent.trigger('end:report');
      }
    },

    graphResize: function() {
      var h = $(window).height() * 0.7;
      this.$('#graph-ui').height( Math.min(h, 720) );
    },

    onBeforeClose: function() {
      $(window).off( 'scroll', this.MAKEwAy );
      $('#content').removeClass('gone');
      $('#score-ui').attr('style', '');
    },

    slugify: function(s) {
      if (s !== 'undefined' && s !== undefined) {
        return s.toLowerCase().replace(/ /g, '-');
      } else {
        return 'uncategorized';
      }
    },


   
    submitEmail1: function() {
      console.log('EMAIL');
      var $input = this.$('#email-input1');
      $input.removeClass('error');
      var email = $input.val();
      if ( this.validateEmail(email) ) {
        this.$('#email-form').addClass('hidden');
        this.$('#email-confirmation').removeClass('hidden');
        this.report( email );
      } else {
        $input.addClass('error');
      }

      ga('send', 'event', {
        'eventCategory': "Report",
        'eventAction': "tap",
        'eventLabel': "Submit Email"
      });
    },
    
    submitEmail2: function() {
      console.log('EMAIL');
      var $input = this.$('#email-input2');
      $input.removeClass('error');
      var email = $input.val();
      if ( this.validateEmail(email) ) {
        this.$('#email-form').addClass('hidden');
        this.$('#email-confirmation').removeClass('hidden');
        this.report( email );
      } else {
        $input.addClass('error');
      }

      ga('send', 'event', {
        'eventCategory': "Report",
        'eventAction': "tap",
        'eventLabel': "Submit Email"
      });
    },

    validateEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    report: function( email ) {

      var data = {
        session: e.reqres.request('session:get'),
        email: email
      };

      if(window.wfc_debug) {
        console.log("Reporing Subscription:", env.api.subscriptionsURL);
        console.log("Subscription", data);
      }

      if (window.location.href.indexOf('localhost') === -1 && window.location.href.indexOf('10.32.10') === -1) {
        $.ajax({
          type: "POST",
          url: env.api.subscriptionsURL,
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            if(window.wfc_debug) console.log("Reporting Success", data);
          },
          failure: function(errMsg) {
            if(window.wfc_debug) console.log("Reporting Error", errMsg);
          }
        });
      }
    }

  });

  return ReportView;

});
