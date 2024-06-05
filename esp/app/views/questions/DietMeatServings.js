/*
* DietDistribution
* Generic Question UI
*/

define(function( require ){

  require('marionette');
  var QuestionUIView = require('./QuestionUIView');
  var template       = require("../templates/qui/diet-meat-servings");
  var e              = require("../../lib/WFCEvents");


  var DietDistribution = QuestionUIView.extend({
    nom: "DietDistribution",
    template: template,
    className: 'group-ui',
    gaEventCategory: "Diet Meat Servings",


    events: function(){
      return this.translateEvents({
        'tap .prev-btn': 'onPrevBtnClick',
        'tap .next-btn': 'onNextBtnClick',
        'tap .changer.less': 'removeMember',
        'tap .changer.more': 'addMember'
      });
    },

    initialize: function() {
      _.bindAll(this);
      var n = e.reqres.request('diet:meat-eaters');
      this.members = _.times(n, function(i){
        return {
          id: i
        };
      });
    },

    onRender: function() {
      _.each(this.members, this.createMember);
      if ( this.model.get('input') ) {
        this.restore();
      }
      if ( this.members.length === 0 ) {
        this.$('.changer').addClass('dead');
      }
      this.enough();
    },

    createMember: function( member ) {
      this.$('#member-pool').append('<div id="member-' + member.id + '" class="member"></div>');
      member.node = this.$('#member-pool').find('#member-' + member.id);
      this.configureChangers();
    },

    removeMember: function(evt) {
      var member = _.find(this.members, function(m){
        return m.assigned && $.contains( $(evt.target).parent().parent()[0], m.node[0] );
      });
      if (member) {
        member.assigned = false;
        var $container = $(member.node).parent();
        this.$('#member-pool').find('.member.used').first().before(member.node);
        this.$('#member-pool').find('.member.used').first().remove();
        // this.$('#member-pool').append(member.node);

        var members = $container.find('.member').length;
        var offset = (members > 0) ? 14 : 0;
        $container.css({ right: -((20 * members) + offset) });

        $container.parent().toggleClass('active', $container.find('.member').length !== 0);
      }
      this.configureChangers();
      this.update();
      this.enough();

      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Remove Member"
      });
    },

    addMember: function(evt) {
      var member = _.find(this.members, function(m){
        return !m.assigned;
      });
      if (member) {
        member.assigned = true;
        var $container = $(evt.target).parent().parent().find('.member-counter');
        $container.append(member.node);
        this.$('#member-pool').append('<div class="member used"></div>');
        $container.css({ right: -((20 * $container.find('.member').length) + 14) });
        $container.parent().addClass('active');
      }
      this.configureChangers();
      this.update();
      this.enough();

      ga('send', 'event', {
        'eventCategory': this.gaEventCategory,
        'eventAction': "tap",
        'eventLabel': "Add Member"
      });
    },

    addMemberToGroup: function( group ) {
      //var action = ( $('html').hasClass('touch') ) ? 'tap' : 'click';
      var action = 'click';
      this.$( group + ' .changer.more' ).trigger( action );
    },

    configureChangers: function() {
      // If all members assigned, kill all the +'s
      var allAssigned = _.every( this.members, function(m){
        return m.assigned;
      });
      this.$('.changer.more').toggleClass('dead', allAssigned);

      // If no members assigned, kill all the -'s
      var noneAssigned = _.every( this.members, function(m){
        return !m.assigned;
      });
      this.$('.changer.less').toggleClass('dead', noneAssigned);

      // If a group is empty, kill it's -
      this.$('.member-node').each(function(){
        $(this).find('.changer.less').toggleClass('dead', !$(this).find('.member-counter .member').length );
      });
    },

    // CUSTOMIZE: Restores input UI using previously recorded input values.
    restore: function() {
      var that = this;
      var input = this.model.get('input');
      // console.log("input", input);
      _.each( input, function( count, key ){
        _.times( count, function(c){
          that.addMemberToGroup('#' + key);
        });
      });
    },

    // CUSTOMIZE: Records input values for future restoration.
    record: function() {
      var groups = {};
      this.$('.member-node').each(function(i, el){
        groups[ $(el).attr('id') ] = $(el).find('.member').length;
      });
      return groups;
    },

    enough: function() {
      if (this.model.progressValidation) this.$('.next-btn').toggleClass('disabled', !this.model.progressValidation() );
    }


  });

  return DietDistribution;

});
