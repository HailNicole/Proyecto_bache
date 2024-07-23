//---------------------------------------------------------------------------------------------
var fs = require('fs');
var url = require('url');
var http = require('http');
var querystring = require('querystring');
var db = []; //database
//---------------------------------------------------------------------------------------------
function requestHandler(request, response) {

    var uriData = url.parse(request.url);
    var pathname = uriData.pathname;
    var query = uriData.query;
    var queryData = querystring.parse(query);
    //-----------------------------------------------------------------------------------------
    if (pathname == '/update') {
        var newData = {
            x: queryData.x,
            y: queryData.y,
            z: queryData.z,
            time: new Date()
        };
        db.push(newData);
        console.log(newData);
        response.end();
    //-----------------------------------------------------------------------------------------
    } else if (pathname == '/get') {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(db));
        db = [];
    //-----------------------------------------------------------------------------------------
    } else { 
        fs.readFile('../frontend/src/index.html', function(error, content) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content);
        });
    }
    //-----------------------------------------------------------------------------------------
}
var server = http.createServer(requestHandler);
server.listen(8000);
console.log('Server listening on port 8000');