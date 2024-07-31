/*
 * Welcome View
 */

define(function (require) {
  require("marionette");
  var e = require("../lib/WFCEvents");
  var template = require("./templates/welcome");

  return Marionette.ItemView.extend({
    nom: "WelcomeView",
    template: template,
    id: "ui-welcome",

    events: function () {
      return this.translateEvents({
        "tap #start-btn": "start",
        "tap #continue-btn": "start",
        "tap #complete-btn": "complete",
        "tap #restart-btn": "restart",
        "click .social-option#twitter": "twitter",
        "click .social-option#facebook": "facebook",
        "click .social-option#google-plus": "googlePlus",
      });
    },

    initialize: function () {
      this.starter = e.reqres.request("question:get:start");
      this.model = this.starter.question || new Backbone.Model();
      if (window.wfc_debug) console.log("starter", this.starter);
    },

    serializeData: function () {
      return _.extend(this.model.attributes, {
        isFirst: this.starter.isFirst,
        isComplete: this.starter.isComplete,
      });
    },

    start: function (evt) {
      e.commands.execute("route:go", this.model.getRoute());
      var label = evt.currentTarget.id === "start-btn" ? "start" : "continue";

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: label,
      });
      return false;
    },

    complete: function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      e.commands.execute("route:go", "/complete/");

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: "complete",
      });
      return false;
    },

    restart: function (evt) {
      if (window.wfc_debug) console.log("RESTART!");
      evt.stopPropagation();
      evt.preventDefault();
      e.commands.execute("global:reset");

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: "restart",
      });
      return false;
    },

    twitter: function (evt) {
      evt.preventDefault();
      var msg =
        "Find out your #waterfootprint with Water Footprint Calculator www.watercalculator.org #savewater !";
      window.open(
        "//twitter.com/home?status=" + encodeURIComponent(msg),
        "_blank"
      );

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: "Twitter",
      });
    },

    facebook: function (evt) {
      evt.preventDefault();
      var msg =
        "Find out your WATER FOOTPRINT with Water Footprint Calculator www.watercalculator.org #savewater !";
      var url = "//www.watercalculator.org";
      window.open("//www.facebook.com/share.php?u=" + url, "_blank");

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: "Facebook",
      });
    },

    googlePlus: function (evt) {
      evt.preventDefault();
      var msg =
        "Find out your WATER FOOTPRINT with Water Footprint Calculator www.watercalculator.org #savewater !";
      var url = "//www.watercalculator.org";
      window.open("//plus.google.com/share?url=" + url, "_blank");

      ga("send", "event", {
        eventCategory: "Welcome",
        eventAction: "tap",
        eventLabel: "Google Plus",
      });
    },
  });
});
