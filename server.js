var express = require("express");
var path = require("path");
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();

// for public folders like css
app.use(express.static(__dirname +'/public'));
// for socket static
app.use(express.static(path.join(__dirname, "./static")));
// for session key
app.use(session({secret: 'jfeohfoelfw'}));
// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// root route
app.get('/', function (req, res){
    if(!req.session.count){
        req.session.count = 0;
        console.log("count click")
    }
    console.log("Landing Page")
    res.render('index.ejs', {count: req.session.count});
});



var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});

var io = require('socket.io').listen(server);
var count = 0;
io.sockets.on('connection', function (socket) {
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here
    socket.on( "count_clicked", function (data){
        count ++;
        socket.emit( 'display_count', {count: count});
    })
    socket.on( "reset_clicked", function (data){
        count = 0;
        socket.emit( 'display_count', {count: count});
    })
    socket.emit( 'display_count', {count: count});
})