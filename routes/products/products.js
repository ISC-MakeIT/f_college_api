const express = require("express");
const router = express.Router();

const connection = require("../../dbConnection");
const scheme = require("./scheme");


// https://fc-fb-live.com/api/products/
router.get("/", (req, res) => {
	let products = {};

	const query = scheme["/"].GET([process.env.SHOW_PRODUCT_IMAGE]).getQuery();
	const table = scheme["/"].GET([process.env.SHOW_PRODUCT_IMAGE]).getTable();

	connection.promise().query(query, table)
		.then(([rows, fields]) => {
			let fashion_products = [];
			let beauty_products = [];
			let items = {};

			for (let item of rows) {
				items = {
					product_id: item.product_id,
					entry_order: item.entry_order,
					product_number: item.product_number,
					title: item.title,
					head_shot: item.photo_path,
					owner: {
						student_id: item.student_id,
						profile_photo: item.profile_photo_path,
						student_name: item.name,
						student_class: item.class,
						leader_flg: true
					}
				};
				if (item.genre === "BEAUTY") {
					beauty_products.push(items);
				}
				if (item.genre === "FASHION") {
					fashion_products.push(items);
				}
			}
			products.fashion = fashion_products;
			products.beauty = beauty_products;
			res.header("Content-Type", "application/json; charset=utf-8");
			res.status(200).json(products);
	
		})
		.catch((err) => {
			console.error(`DB Error:${err}`);
			res.status(500).send("DB Error, failed to get products. please check log file");
		});
});

// https://fc-fb-live.com/api/products/1
router.get("/:id", (req, res) => {
	let product = {};
	let id = req.params.id;

	const productQuery = scheme["/:id"].GET[1](id).getQuery();
	const productTable = scheme["/:id"].GET[1](id).getTable();

	connection.promise().query(productQuery, productTable)
		.then(([captions, fields]) => {
			product = {
				product_id: captions[0].product_id,
				genre: captions[0].genre,
				theme: captions[0].theme,
				concept: captions[0].concept
			};
		})
		.catch((err) => {
			console.error(`DB Error:${err}`);
			res.status(500).send("DB Error, failed to get product info. please check log file");
		});

	const photoQuery = scheme["/:id"].GET[2](id).getQuery();
	const photoTable = scheme["/:id"].GET[2](id).getTable();

	connection.promise().query(photoQuery, photoTable)
		.then(([photo, fields]) => {
			let photos = [];
			for (let item of photo) {
				photos.push(item.photo_path);
			}
			product.photos = photos;
		})
		.catch((err) => {
			console.error(`DB Error:${err}`);
			res.status(500).send("DB Error, failed to get photo info. please check log file");
		});

	const membersQuery = scheme["/:id"].GET[3](id).getQuery();
	const membersTable = scheme["/:id"].GET[3](id).getTable();

	connection.promise().query(membersQuery, membersTable)
		.then(([member, fields]) => {
			let members = [];
			for (let item of member) {
				let items = {};
				items = {
					student_id: item.student_id,
					profile_photo: item.profile_photo_path,
					student_name: item.name,
					student_class: item.class,
					leader_flg: false
				};
				if (item.leader_flg === 1) {
					items.leader_flg = true;
				}
				members.push(items);
			}
			product.members = members;

			res.set("Content-Type", "application/json; charset=utf-8");
			res.status(200).json(product);

		})
		.catch((err) => {
			console.error(`DB Error:${err}`);
			res.status(500).send("DB Error, failed to get members info. please check log file");
		});
});

module.exports = router;
