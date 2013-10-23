var titan = require('../../');
var ArtistsResource = require('./artists_resource');

titan()
  .add(ArtistsResource)
  .listen(3000);
