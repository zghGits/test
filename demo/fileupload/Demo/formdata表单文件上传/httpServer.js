var http = require("http");
var util = require("util");
var queryString = require("querystring");

var server = http.createServer(function(req,res){
	res.writeHead(200,{
		"Content-Type":"text/plain",
		"Access-Control-Allow-Origin":"*"}
	);
	
	/*		针对post请求的响应		*/
	var postRes = "";
	req.on("data",function(chunk){
		postRes += chunk;
	});
	req.on("end",function(){
		postRes = queryString.parse(postRes);//解析成真正的post请求格式
		res.end(util.inspect(postRes));
	})
});

//监听端口
server.listen(5858,"localhost",function(){	
	console.log("loading...");
});