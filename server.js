'use strict';

//Set up global variables
var port = process.env.PORT || 8001;
var dataFile = './data/products.json';

//Set up npm modules
var fs = require('fs');
var jp = require('jsonpath')
var express = require('express');
var app = express();

//Set up npm modules for Swagger UI
var swaggerUi = require('swaggerize-ui');

//Endpoint to get master data for all products
app.get('/products', function(req, res) {
	fs.readFile(dataFile, 'utf8', function(err, data){
		res.end(data);
	});
})

//Endpoint to get master data for a given GTIN
app.get('/products/:gtin', function(req, res) {
	fs.readFile(dataFile, 'utf8', function(err, data){
		var products = JSON.parse(data);
		var product = jp.query(products, '$..[?(@.gtin==' + req.params.gtin + ')]');
		res.end(JSON.stringify(product));
	});
})

//Endpoint to get Swagger API specification
app.get('/swagger', function(req, res) {
	fs.readFile('./docs/swagger.json', 'utf8', function(err, data){
		res.end(data);
	});
})

//Endpoint for Swagger UI
app.use('/docs', swaggerUi({
  docs: '/swagger'
}));

//Start the web server and listen for requests
var server = app.listen(port, function () {
	var host = server.address().address
	var port = server.address().port
	
	console.log("Product Assets service listening at http://%s:%s", host, port)
});