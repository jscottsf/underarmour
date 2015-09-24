UnderArmour = {};

// Request UnderArmour credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//  completion. Takes one argument, credentialToken on success, or Error on
//  error.
UnderArmour.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'underArmour'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();

  var loginStyle = OAuth._loginStyle('underArmour', config, options);

  var loginUrl =
      'https://www.mapmyfitness.com/v7.1/oauth2/uacf/authorize/' +
      '?client_id=' + config.clientId +
      '&redirect_uri=' + OAuth._redirectUri('underArmour', config) +
      '&response_type=code' +
      '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "underArmour",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};