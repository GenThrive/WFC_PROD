/*
* Model
* Model primitive.
*/


define(function( require ){

  require('backbone');

  var Model = Backbone.Model.extend({

    nom: "Model",
    // idAttribute: "_id" // eg. "_id", "ID", default: "id"

  });

  return Model;

});

