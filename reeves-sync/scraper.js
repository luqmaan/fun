/** scraper.js
 * 	Contains the scraper functions
 * 	Scrapers receive a jQueryified DOM and return an array of INSERTS 
 */

var http = require('http');

exports.bmw = function($,brand) {

	// temp store the insert statemts
	var inserts = []

	$(".offer").each(function() {

		// get data
		var img_url = $(this).find("img").attr("src")
		var headline = $(this).find("h4").text()
		var description = $(this).find("a").filter(function() {
			return $(this).css("display") === "block"
		}).text()

		// clean data
		headline = clean(headline)
		description = clean(description)

        var request = http.get(img_url);
        console.log("Loading " + img_url);
        request.on('response', function (res) {
			console.log("Downloaded "  + img_url);
            res.on('data', function (buffer) {
            		base64 = buffer.toString('base64');
	        		var insert = writeInsert(brand, headline, description, base64)
					inserts.push(insert)
					console.log(insert);
            });
        });

	})

	return inserts
}

exports.dealerDotCom = function($,brand) {

	// temp store the insert statemts
	var inserts = []

	// handle no specials
	var no_specials_indicator = strip($(".bd2 .highlight.ui-state.ui-state-highlight.ui-corner-all").text())
	if (no_specials_indicator.indexOf("specialsareavailableatthistime.Pleasecheckbacklater!") != -1)
		return false

	// get data
	var headline = $(".dsbTitle").text()
	var price = $(".dsbPriceCont").text()
	var details = $(".dsbCont").html()

	// clean data
	headline = clean(headline)
	price = clean(price)
	details = clean(details)

	var description = price + "<br />" + details

	var insert = writeInsert(brand, headline, description, base64)

	// yes, this is an array of one
	inserts = [insert]

	return inserts
}

function writeInsert(brand, headline, description, base64) {
	var insert = "INSERT INTO `specials` (`make`, `thumb`, `headline`, `description`, `base64`) "
	insert += "VALUES ('" + brand + "', '', '"+  headline+ "', '" + description + "', '" + base64 + "');"
	return insert
}

function clean(str) {
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, " ").replace(/\"/g, '').replace(/\'/g, '')
}
function strip(str) {
	// kills all whitespace
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, "")
}
