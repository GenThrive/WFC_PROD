define(function( require ){

  require('handlebars');
  var environment = [ENV];

  Handlebars.registerHelper('appRoot', function(){
    return environment.appRoot;
  });

  return environment;
});
