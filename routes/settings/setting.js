const fs = require("fs");
const basicAuth = require('basic-auth-connect');

const express = require("express");
const router = express.Router();

router.use(basicAuth(process.env.SETTING_ADMIN, process.env.SETTING_PASSWORD));

const connection = require("../../dbConnection");

// https://fc-fb-live.com/api/settings/toggleImage
router.post("/toggleImage", async (req, res) => {
	let env = fs.readFileSync('.env', "utf-8");
	let state;
	if (parseInt(process.env.SHOW_PRODUCT_IMAGE)) { // true(1)
		env = env.replace("SHOW_PRODUCT_IMAGE=1", "SHOW_PRODUCT_IMAGE=0");
		state = "非公開";
		process.env.SHOW_PRODUCT_IMAGE = 0;
	} else { // false(0)
		env = env.replace("SHOW_PRODUCT_IMAGE=0", "SHOW_PRODUCT_IMAGE=1");
		state = "公開";
		process.env.SHOW_PRODUCT_IMAGE = 1;
	}
	fs.writeFileSync(".env", env, "utf-8");
	res.status(200).json({"message": `現在の状態:${state}`});
});

module.exports = router;
