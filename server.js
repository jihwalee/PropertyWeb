require('rootpath')();

// Dependencies
// ---------------------------------

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var database = require('./app/config');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var app = express();
var port = process.env.PORT || 3000;


var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
//mongoose.connect(database.mongolab.url);

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components', express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(session({secret: config.secret, resave: false, saveUninitialized: true}));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'actionpower_nai_propertree_secret',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session());    // persistent login sessions
app.use(flash());   // use connect-flash for flash messages stored in session

// use JWT auth to secure the api
app.use('/api', expressJwt({secret: config.secret}).unless({path: ['/api/users/authenticate', '/api/users/register']}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Routes
// ------------------------------------------------------
require('./app/routes.js')(app, passport);  // load our routes and pass in our app
// and fully configured passport


/*
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));


// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});
*/


// start server
//var server = app.listen(3000, function () {
//    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
//});

// Listen
// -------------------------------------------------------
var server = app.listen(port);
console.log('App listening at http://' + server.address().address + ':' + port);
