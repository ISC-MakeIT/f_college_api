const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const app = express();

// application settings
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// ルーティング先
const indexRouter = require("./routes/index.js");
app.use("/", indexRouter);

const ProductsRouter = require("./routes/products/products.js");
app.use("/api/products", ProductsRouter);

const VoteRouter = require("./routes/vote/vote.js");
app.use("/api/vote", VoteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
