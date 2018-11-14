const Scheme = require("../module/scheme");

const scheme = {
	"/": {
		"POST": {
			"query": "UPDATE ?? SET ?? = ?? + 1 WHERE ?? = ?",
			"table": ["vote", "number_of_votes", "number_of_votes", "product_id"]
		},
		"DELETE": {
			"query": "UPDATE ?? SET ?? = ?? - 1 WHERE ?? = ?",
			"table": ["vote", "number_of_votes", "number_of_votes", "product_id"]
		}
	}
};

module.exports = {
	"/": {
		"POST": (param) => { return new Scheme(scheme["/"].POST.query, scheme["/"].POST.table, param); },
		"DELETE": (param) => {return new Scheme(scheme["/"].DELETE.query, scheme["/"].DELETE.table, param); }
	}
};
