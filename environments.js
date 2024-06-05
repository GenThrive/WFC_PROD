var environments = {
    local: {
    envName: 'local',
    appRoot: '/',
    api: {
      responsessURL: "//www.watercalculator.org:8443/wfc-api/responses.php",
      subscriptionsURL: "//www.watercalculator.org:8443/wfc-api/subscriptions.php"
    }
  },
  
  //appRoot must have trailing slash
  wpengine_dev: {
    envName: 'wpedev',
    appRoot: '/wfc2/',
    api: {
      responsessURL: "//data.watercalculator.org:8443/wfc-api/responses.php",
      subscriptionsURL: "//data.watercalculator.org:8443/wfc-api/subscriptions.php"
    }
  },

  wpengine_production: {
    envName: 'wpeprod',
    appRoot: '/wfc2/',
    api: {
      responsessURL: "//data.watercalculator.org:8443/wfc-api/responses.php",
      subscriptionsURL: "//data.watercalculator.org:8443/wfc-api/subscriptions.php"
    }
  }

};

module.exports = function( env ){
  return environments[ env ];
};
