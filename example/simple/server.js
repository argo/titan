var titan = require('../../');
var ArtistsResource = require('./artists_resource');

titan()
  .allow('*')
  .add(ArtistsResource)
  .listen(3000);
