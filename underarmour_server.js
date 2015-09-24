UnderArmour = {};

// https://developer.underarmour.com/docs/v71_User
UnderArmour.whitelistedFields = ['birthdate', 'display_name', 'email', 'first_name',
                        'gender', 'last_name', 'location', 'username'];


OAuth.registerService('underArmour', 2, null, function(query, callback) {

  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var identity = getIdentity(accessToken);

  var serviceData = {
    id: response.user_id + "",
    accessToken: accessToken,
    refreshToken: response.refresh_token,
    expiresAt: (+new Date) + (1000 * response.expires_in)
  };

  var fields = _.pick(identity, UnderArmour.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.display_name}}
  };
});

// return an object containining:
// - accessToken
// - expires_in: the TTL, in seconds, for the access token
// - refresh_token: a string the Client Application may trade to get a new access token
// - scope: the scope of operations allowed to the access token
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'underArmour'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var params = {
    code: query.code,
    client_id: config.clientId,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('underArmour', config, null, {replaceLocalhost: true}),
    grant_type: 'authorization_code'
  };
  var paramlist = [];
  for (var pk in params) {
    paramlist.push(pk + "=" + params[pk]);
  };

  var response;
  try {
    response = HTTP.post(
      "https://api.ua.com/v7.1/oauth2/uacf/access_token/", {
        content: paramlist.join("&"),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Api-Key': config.clientId
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Under Armour. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Under Armour. " + response.data.error);
  } else {
    return response.data;
  }
};

var getIdentity = function (accessToken, userId) {
  var config = ServiceConfiguration.configurations.findOne({service: 'underArmour'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  try {
    return HTTP.get(
      "https://api.ua.com/v7.1/user/self/", {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Api-Key': config.clientId
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Weibo. " + err.message),
                   {response: err.response});
  }
};

UnderArmour.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
