var argo = require('argo');
var titan = require('../../');
var ArtistsResource = require('./artists_resource');

argo()
  .use(titan)
  .allow('*')
  .compress()
  .logger()
  .add(ArtistsResource)
  .listen(3000);

