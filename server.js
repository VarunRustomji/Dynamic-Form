var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/html'});
  fs.createReadStream(__dirname + '/error.html').pipe(res);
}

var server = http.createServer();
server.on('request', function(req,res){

  console.log('Request URL :', req.url);
  var urlObj = url.parse(req.url, true);

  if (req.method === 'GET' && req.url=== '/'){ //Root directory
    fs.readFile('./form.html', function(err , contents){ //sending HTML
      if(err){
        send404(res); //handle error
      } else {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(contents);
        res.end();
      }
    });
  } else if (req.method === 'GET' && req.url.match("\.css$")){ //sending CSS
    fs.readFile('./style.css', function(err, contents){
      if(err){
        send404(res);//Handle error
      }else {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.write(contents);
        res.end();
      }
    });
  } else if (req.method === 'GET' && req.url === '/dynamic.js' ){  //sending JS
    fs.readFile('./dynamic.js', function(err, contents){
      if(err){
        send404(res);
      }else {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.write(contents);
        res.end();
      }
    })
  } else if (req.method === 'GET' && req.url === '/data/users.json'){ //GET the form
    fs.readFile( './data/users.json', function(err, content ){
      if(err){
        if(err.code == 'ENOENT'){
          console.log("in here");
          res.writeHead(200, {"Content-Type": "application/json"});
          var formData = {
            firstname: null,
            lastname: null,
            gender: null,
            email: null,
          };
          res.end(JSON.stringify(formData,null,2));
        } else {
          console.log('NEW' ,err.message);
        }

      } else {
        res.writeHead(200, {"Content-Type": "application/json"});
        console.log('USIING THIS NOW' , content);

        res.write(content);
        res.end();
      }
    });
  } else if( req.method === 'GET' && req.url === '/users.html'){
    var htmlFile = ``;


    fs.readFile('./data/users.json', function (err, content){
      if(err){
        console.log("NEW ISSUE", err.message);
      }

      var objectData = JSON.parse(content);

      var a = 0;
      index = 'Email_'+a;

      console.log(index);

      if (typeof objectData[index] === 'string' || objectData[index] instanceof String){
        htmlFile +=`<tr><td>`+objectData.Firstname+`</td>`;
        htmlFile +=`<td>`+objectData.Lastname+`</td>`;
        htmlFile +=`<td>`+objectData.Gender+`</td>`;
        htmlFile +=`<td>`+objectData.Birthday+`</td>`;
      } else {

        for(var i=0 ; i<objectData.Firstname.length ; i++ ){

          htmlFile +=`<tr><td>`+objectData.Firstname[i]+`</td>`;
          htmlFile +=`<td>`+objectData.Lastname[i]+`</td>`;
          htmlFile +=`<td>`+objectData.Gender[i]+`</td>`;
          htmlFile +=`<td>`+objectData.Birthday[i]+`</td>`;
        }
      }

      for(var i=0 ; i<objectData.Firstname.length ; i++ ){
        var index = 'Email_'+i;

        if (typeof objectData[index] === 'string' || objectData[index] instanceof String){
          htmlFile +=`<td>`+(objectData[index])+`</td>` ;
          break;
        }
        else {
          console.log(objectData[index]);
          console.log(typeof objectData[index]);
          htmlFile +=`<td>`+objectData[index]+`</td>` ;
          htmlFile += `</td>`
        }
        htmlFile +='</tr>';
      }



      res.writeHead(200, {"Content-Type": "text/html"});
      res.write('<html><head></head><body>');
      res.write(`
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>Assignment 2</title>
        <style>
        h1 {
          text-align: center;
          font-size: 5em;
          font-style : italic;
          width:50%;
          margin-left:25%;
          margin-right:25%;
        }
        table {
          border: 3px black solid;
          margin-left:auto;
          margin-right:auto;
          background-color: #f1f1f1;
          align-items: center;
          border-collapse: collapse;

        }
        td , tr {
          border: 1px black solid;
          text-align: center;
          vertical-align: middle;
        }
        </style>
        </head>
        <body>
        <h1>DATA IN HTML FORMAT<h1>
        <table cellpadding="10">
        <tr>
        <td>Fitst Name</td>
        <td>Lastname</td>
        <td>Gender</td>
        <td>Birthday</td>
        <td>Email(s)</td>
        </tr>
        `);
        res.write(htmlFile);
        res.end('</body></html>');


      });

    } else if (req.method === 'POST' && req.url === '/'){ //Submitting the form

      var users = '';
      req.on('data', function(data){
        users +=data.toString();
      });
      req.on('end', function(){
        var postObj = qs.parse(users);
        var userData = JSON.stringify(postObj,null,2);

        fs.writeFile('./data/users.json', userData , function(err, content){
          if(err){
            send404(res);
          }
          res.writeHead(200, {'Content-Type': 'text/html'});
          fs.createReadStream(__dirname + '/submit.html').pipe(res);
        });

      });
    } else {
      console.log("req.url is :", req.url)
      send404(res);
    }

  });

  server.listen(8080);
  console.log('Listening to 8080');
