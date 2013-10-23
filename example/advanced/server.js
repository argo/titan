var titan = require('../../');
var siren = require('argo-formatter-siren');
var cors = require('./middleware/cors');
var url = require('./middleware/url');


titan()
  .use(cors)
  .use(url)
  .format({
    engines: [siren],
    override: {
      'application/json': siren
    }
  })
  .listen(3000);
