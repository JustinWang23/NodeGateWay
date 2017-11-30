var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");
var shortid = require("shortid");

var index = require('./routes/index');
var users = require('./routes/users');
var tests = require('./routes/tests');

var logger = require('./configs/logger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/nojwt", function (req, res) {
  res.send('this will not through jwt')
})

app.use('/test', tests);

app.use(expressJwt({secret: "12345"}).unless({path: ["/login"]}));

app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!username) {
    return res.status(400).send("username require");
  }
  if (!password) {
    return res.status(400).send("password require");
  }

  if (username != "admin" && password != "password") {
    return res.status(401).send("invaild password");
  }

  var authToken = jwt.sign({username: username}, "12345");
  res.status(200).json({token: authToken});

});

app.post("/user", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var country = req.body.country;
  var age = req.body.age;

  if (!username) {
    return res.status(400).send("username require");
  }
  if (!password) {
    return res.status(400).send("password require");
  }
  if (!country) {
    return res.status(400).send("countryrequire");
  }
  if (!age) {
    return res.status(400).send("age require");
  }

  res.status(200).json({
    id: shortid.generate(),
    username: username,
    country: country,
    age: age
  })
})

app.get("/user/:id", function (req, res) {
  var params = req.params

  res.status(200).json({id: params.id})
})

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token");
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
