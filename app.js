const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const app = express();

// application settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング先
const TopRouter = require('./routes/top.js');
app.use('/', TopRouter);

const ProductsRouter = require('./routes/products/products.js');
app.use('/api/products', ProductsRouter);

const VoteRouter = require('./routes/vote/vote.js');
app.use('/api/vote', VoteRouter);

const MyDataRouter = require('./routes/user/mydata.js');
app.use('/api/mydata', MyDataRouter);

const LikeRouter = require('./routes/like/like.js');
app.use('/api/:id/like', LikeRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;