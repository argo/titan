var titan = require('../../');
var siren = require('argo-formatter-siren');


titan()
  .allow('*')
  .format({
    engines: [siren],
    override: {
      'application/json': siren
    }
  })
  .listen(3000);
