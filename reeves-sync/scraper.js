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
		var img = $(this).find("img")
		var headline = $(this).find("h4").text()
		var description = $(this).find("a").filter(function() {
			return $(this).css("display") === "block"
		}).text()

		// clean data
		headline = clean(headline)
		description = clean(description)

		console.log("about to read canvas");
	    // Create an empty canvas element
	  	($(this)).add("<canvas>")

	  	var canvas = $(this).find("canvas")
//	    console.log(canvas.text());
//	    
//	    

		canvas = canvas[0];

	    console.log("got convas");
	    canvas.width = img.width()
	    canvas.height = img.height()

	    console.log("set width of canvas");

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d")
	    console.log("got canvas context");
	    ctx.drawImage(img[0], 0, 0)

	    console.log("drew image");
	    // Get the data-URL formatted image
	    // Firefox supports PNG and JPEG. You could check img.src to
	    // guess the original format, but be aware the using "image/jpg"
	    // will re-encode the image.
	    var base64 = canvas.toDataURL("image/jpeg").replace(/^data:image\/(png|jpeg);base64,/, "")

	    console.log("got data url: " + base64);
    	var insert = writeInsert(brand, headline, description, base64)

	    inserts.push(insert)
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