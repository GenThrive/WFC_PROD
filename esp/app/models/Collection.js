/*
* Collection
* Collection Primitive
*/

define(function( require ){

  require('backbone');
  require('prettynames');

  var Collection = Backbone.Collection.extend({

    nom: "Collection",

    saveAll : function() {
      this.each(function(m){
        m.save();
      });
    },

    destroyAll: function() {
      while (this.first()) {
        this.first().destroy();
      }
    }

  });

  return Collection;

});
