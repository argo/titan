var titan = require('../../');
var siren = require('argo-formatter-siren');

titan()
  .allow('*')
  .compress()
  .format({
    engines: [siren],
    override: {
      'application/json': siren
    }
  })
  .load()
  .listen(3000);
