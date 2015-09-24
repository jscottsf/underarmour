Package.describe({
  // name: 'selaias:underarmour',
  summary: 'Under Armour (MapMyFitness) OAuth flow',
  version: '0.1.0',
  // git: 'https://github.com/selaias/underarmour.git'
});

Package.on_use(function(api) {

  api.versionsFrom('METEOR@1.0');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('UnderArmour');

  api.add_files(
    ['underarmour_configure.html', 'underarmour_configure.js'],
    'client');

  api.add_files('underarmour_server.js', 'server');
  api.add_files('underarmour_client.js', 'client');
});
