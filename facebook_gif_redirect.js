var express = require('express');
var app = express();
var url = require('url');
var http = require('http');

app.get('/fish.gif', function(request_from_client, response_to_client){
    var agent = request_from_client['headers']['user-agent'].toLowerCase();
    var isFacebook = agent.indexOf('vision') > -1 || agent.indexOf('facebook') > -1;

    if(!isFacebook) {
        response_to_client.writeHead(302, {
            'Location': 'http://www.staatsloterij.nl',
        });
        return response_to_client.end();
    }
    
    var image_url = 'http://www.heidivanderwesten.nl/test/img.gif';
    var image_host_name = url.parse(image_url).hostname
    var filename = url.parse(image_url).pathname.split("/").pop()

    var http_client = http.createClient(80, image_host_name);
    var image_get_request = http_client.request('GET', image_url, {"host": image_host_name});
    image_get_request.addListener('response', function(proxy_response){
        var response_content_length = parseInt(proxy_response.headers["content-length"]);
        var response_body = new Buffer(response_content_length);

        response_to_client.writeHead(proxy_response.statusCode, proxy_response.headers)

        proxy_response.setEncoding('binary');
        proxy_response.addListener('data', function(chunk){
            response_to_client.write(chunk, "binary");
        });
        proxy_response.addListener('end', function(){
            response_to_client.end();
        });
    });
    image_get_request.end();
});
