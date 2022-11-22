const https = require("https");
const parser = require("node-html-parser");

getSite();

function getSite() {
	console.log("fetching site!");
	let options = {
		hostname: "counterstrike.fandom.com",
		path: "/wiki/Skins/List",
		method: "GET",
		headers: {
		}
	}

	let response = "";
	let skins = [];

	let req = https.request(options, (res) => {
		res.on('data', d => {
			response += d.toString();
		});

		res.on('end', () => {
			let root = parser.parse(response);
			console.log(root);
			let collectionNames = [];
			root.querySelectorAll("h4").forEach(el => {
				// console.log(el.childNodes[-1].childNodes[0]);
				collectionNames.push(el.querySelector('a').childNodes[0].rawText);
			});

			let k = 0;
			
			root.querySelectorAll(".wikitable").forEach(table => {
				
				table.querySelectorAll('tr').forEach((row, idx) => {
					if(idx == 0)
					{
						return;
					}
					
					let skin = {};

					skin.collection = collectionNames[k];
					skin.weapon = row.querySelector('a').childNodes[0].rawText;
					skin.skin = row.querySelectorAll('span')[0].childNodes[0].rawText;
					skin.quality = row.querySelectorAll('span')[1].childNodes[0].rawText;

					skins.push(skin);

				});

				k++;

			})
			console.log(skins);
		})
	});

	req.end();
}