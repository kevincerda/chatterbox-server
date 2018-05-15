/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const body = [];

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  var obj = {};

  if (request.method === "POST" && request.url.startsWith("/classes/messages")) {
    request.on('data', (chunk) => {
      body.push(JSON.parse(chunk))
    }).on('end', () => {
      response.writeHead(201, headers);
      obj.results = body;
      response.end(JSON.stringify(obj));
    })
  } else if (request.method === "GET" && request.url.startsWith("/classes/messages")) {
    response.writeHead(200, headers);
    obj.results = body;
    response.end(JSON.stringify(obj));
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;
