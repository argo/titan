var titan = require('../../');
var ArtistsResource = require('./artists_resource');

titan()
  .allow('*')
  .compress()
  .add(ArtistsResource)
  .listen(3000);
