//require('rootpath')();

// Dependencies
// ---------------------------------
var config = require('./config.json');

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var app = express();

var expressJwt = require('express-jwt');
var methodOverride = require('method-override');


// configuration ===============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
// Logging and Parsing
app.use(morgan('dev'));                                         // log with Morgan
app.use(cookieParser());
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
//app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
//app.use(bodyParser.json({type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(passport.initialize());
app.use(passport.session());    // persistent login sessions
app.use(flash());   // use connect-flash for flash messages stored in session
app.use(session({secret: config.secret, resave: true, saveUninitialized: true}));
//app.use(methodOverride());

//app.use('/bower_components', express.static(__dirname + '/bower_components')); // Use BowerComponents
app.set('view engine', 'ejs');
//app.set('views', __dirname + '/views');

// use JWT auth to secure the api
//app.use('/api', expressJwt({secret: config.secret}).unless({path: ['/api/users/authenticate', '/api/users/register']}));

// sets the static files location to public
//app.use(express.static(__dirname + '/public'));

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app, passport);  // load our routes and pass in our app and fully configured passport


// Listen
// -------------------------------------------------------
var server = app.listen(port);
console.log('App listening at http://localhost' + ':' + port);
