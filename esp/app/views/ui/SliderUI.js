/*
* SliderUI
* Slider UI View
*/

define(function( require ){

  require('marionette');
  var template = require('../templates/ui-slider');

  var SliderUI = Marionette.ItemView.extend({

    nom: 'SliderUI',
    className: 'slider-ui',
    template: template,
    

    events: function(){
      return this.translateEvents({
        'mousedown .ui-slider-shuttle': 'startDrag',
        'touchstart .ui-slider-shuttle': 'startDrag'
      });
    },

    
    dragging: false,
    val: 0,

    initialize: function() {
      _.bindAll(this, ['drag', 'startDrag', 'endDrag', 'onResize']);
    },

    onRender: function() {
      this.$track = this.$('.ui-slider-track');
      this.$shuttle = this.$('.ui-slider-shuttle');

      this.$track.mousemove( this.drag );
      $('body').mouseup( this.endDrag );

      this.$track.on('touchmove', this.drag );
      $('body').on('touchend', this.endDrag );

      $(window).resize(this.onResize);
    },

    startDrag:function() {
      this.$shuttle.addClass('dragging');
      this.dragging = true;

      ga('send', 'event', {
        'eventCategory': "Slider Input",
        'eventAction': "mousedown",
        'eventLabel': "Drag"
      });

    },

    endDrag:function() {
      this.$shuttle.removeClass('dragging');
      this.dragging = false;
      this.trigger('update', this.val);
    },

    drag: function(evt, force) {
      if( this.dragging || force ) {

        evt.preventDefault();

        this.val = parseInt(this.$shuttle.css('left'))/(this.$track.width()-this.$shuttle.width()) || 0;

        this.trigger('slide', this.val);

        var h = this.$shuttle.width()/2;
        var pX = evt.pageX || evt.originalEvent.pageX;
        if (evt.originalEvent.touches) {
          pX = evt.originalEvent.touches[0].pageX;
        }
        var oX = pX - this.$track.offset().left - h;

        var min = 0;
        var max = this.$track.width() - (h*2);
        var threshold = this.options.threshold || 20;
        if (oX < min + threshold) oX = min;
        if (oX > max - threshold) oX = max;
        this.$shuttle.css({left:oX});

        // console.log("›", this.val, oX, pX, evt);
      }
    },

    setShuttleDisplay: function(s) {
      this.$('.ui-slider-shuttle-display').html(s);
    },

    setValue: function(v) {
      this.val = v || this.val;
      var oX = (this.val * this.$track.width()) - (this.val * this.$shuttle.width());
      this.$shuttle.css({left:oX});
    },

    getValue: function() {
      return this.val || 0;
    },

    onResize: function() {
      this.setValue(this.val);
    }

  });

  return SliderUI;

});
