const Swagger = require('swagger-client');

class Client extends Swagger {

  idFromOp(path, httpMethod, op) {
    op.operationId = op['x-swagger-router-action'];
    return super.idFromOp(path, httpMethod, op);
  }

}

exports = module.exports = Client;
