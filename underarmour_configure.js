Template.configureLoginServiceDialogForUnderArmour.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForUnderArmour.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};