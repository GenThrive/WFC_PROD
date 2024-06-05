/*
* Virtual Water Use
* No inputs!
*/

define(function(require){

  var QuestionUIView = require('./QuestionUIView');
  var template = require('../templates/qui/virtual-water-use');

  var VirtualWaterUse = QuestionUIView.extend({

    nom: "VirtualWaterUse",
    template: template

    // this view only uses the PREV and NEXT buttons, so ga is tracked there..
    //gaEventCategory: "none",

  });

  return VirtualWaterUse;
});
