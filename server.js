const express = require('express');
var compression = require('compression')
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
var http = require('http');
var https = require('https');
var forceSsl = require('express-force-ssl');
const io = require('socket.io')(http);
const fs = require('fs')        
const uniqid = require('uniqid')

//routes
var API = require('./routes/api.js');

const cert = fs.readFileSync(__dirname + '/certificate/147.182.241.143.crt');
const key = fs.readFileSync(__dirname + '/certificate/147.182.241.143.key');

var credentials = {key: key, cert: cert};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


//app.use(forceSsl);
app.use(compression())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get("/main.js",function(req, res){
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes(__dirname + '/dist/main.js')
  });
  res.sendFile(__dirname + '/dist/main.js')
})

app.get("/css.js", (req, res) => {
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes(__dirname + '/dist/css.js')
  });
  res.sendFile(__dirname + '/dist/css.js')
})

app.get("/NCache.js", (req, res) => {
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes(__dirname + '/dist/NCache.js')
  });
  res.sendFile(__dirname + '/dist/NCache.js')
})

app.get("/nedb.js", (req, res) => {
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes(__dirname + '/dist/nedb.js')
  });
  res.sendFile(__dirname + '/dist/nedb.js')
})

app.get("/img/:file",function(req, res){
    var file = req.param('file')
    res.header({
      'Content-Type': 'image/png',
      'Content-Length': getFilesizeInBytes(__dirname + '/src/img/' + file)
    });
    res.sendFile(__dirname + '/src/img/'+file)
})



app.get("/audio/:file", (req, res) => {
  res.header({
    'Content-Type': 'audio/mpeg',
    'Content-Length': getFilesizeInBytes(__dirname + `/src/audio/${req.params.file}`),
    'Accept-Ranges': 'bytes', 
  });
  res.sendFile(__dirname + `/src/audio/${req.params.file}`);
});

app.get('/favicon.ico', (req, res) => {
    res.header({
      'Content-Type': 'text/javascript',
      'Content-Size': getFilesizeInBytes(__dirname + '/src/img/icons-512.png')
    });
    res.sendFile(__dirname + '/src/img/icons-512.png')
})

app.get("/manifest.json", (req, res) => {
    res.sendFile(`${__dirname}/dist/manifest.json`)
})

app.get("/robots.txt", (req, res) => {
    res.sendFile(`${__dirname}/robots.txt`)
})

app.get("/worker", (req, res) => {
    res.header({
      'Content-Type': 'text/javascript',
      'Content-Size': getFilesizeInBytes(__dirname + '/web_service_worker.js')
    });
    res.sendFile(`${__dirname}/web_service_worker.js`)
})

app.get("/current_version",(req, res) => {
  res.sendFile(`${__dirname}/update_version`)
})

app.get('/scan_network', (req, res) => {
  var json = {
      'NIK-NET':{
          ssid:'NIK-NET',
          mac_address:'2c.4a.2a.4d.da.5d',
          signal_strength: '-42',
          enc_type: 'Secured'
      }
  }

  res.send(json)
})

app.get('/send_serial/:command', (req, res) => {
  console.log(req.params.command)
  res.send(true)
})

app.get('/read_serial', (req, res) => {
  res.send({data:'OK\n'})
})


app.use('/API', API)

app.get('*', (req, res) => {
  fs.readFile('update_version', 'utf8', (error, data) => {
    res.sendFile(`${__dirname}/dist/index.html`)
  });
})

httpServer.listen(80);



function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}