var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');


var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect("mongodb://test:test@ds017672.mlab.com:17672/graph");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected");
});
db.on("error",function (err) {
  console.log("DB ERROR: ",err);
});

//model setting
var dataSchema = mongoose.Schema({
  data:{type:String},
  createdAt:{type:Date,default:Date.now},
});
var Push = mongoose.model('push',dataSchema);

//var pushdata = [];

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*
app.get('/',function(req,res){
    res.sendFile(__dirname +'/index.html');
});
*/
app.get('/',function (req,res) {
  res.render('index');
});
app.get('/realtimechart',function (req,res) {

  res.render('realtimechart');
});
app.get('/datatable',function (req,res) {
  res.render('datatable');
});
app.get('/manual',function (req,res) {
  res.render('manual');
});

app.post('/realtimechart',function (req,res) {
  Push.create(req.body.push,function (err,push) {
    io.emit('chat message',push.data);
    console.log(push.data);
    res.json({success:true,data:push});
    //pushdata.push(push.data);

    //console.log(pushdata);
  });
});

http.listen(3000,function(){
    console.log('listening at 3000');
});
