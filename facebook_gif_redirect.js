var express = require('express');
var app = express();
var url = require('url');
var http = require('http');

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
})

app.get('/facebook.gif', function(request_from_client, response_to_client){
    var redirectUrl = request_from_client.query.redirectUrl;
    var imageUrl = request_from_client.query.imageUrl;
    var agent = request_from_client['headers']['user-agent'].toLowerCase();
    var isFacebook = agent.indexOf('vision') > -1 || agent.indexOf('facebook') > -1;

// Redirect URL
const redirectUrl = 'http://www.tgwg.co';

    if(!isFacebook && redirectUrl) {
        response_to_client.writeHead(302, {
            'Location': redirectUrl,
        });
        response_to_client.end();

        return;
    }

    var image_host_name = url.parse(imageUrl).hostname
    var http_client = http.createClient(80, image_host_name);
    var image_get_request = http_client.request('GET', imageUrl, {"host": image_host_name});
    image_get_request.addListener('response', function(proxy_response){
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
