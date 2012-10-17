console.log("hai")

var Crawler = require("crawler").Crawler
	fs = require('fs'),
	path = require('path')

/* Configuration */

var filename = "inserts.sql";
var audi_urls = ["http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A4+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A6+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+A8+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+Q5+Specials",
	"http://www.auditampa.com/specials/index.htm?category=The+2013+Audi+Tampa+S4+Specials"]
var subaru_urls = ["http://www.subaruoftampa.com/specials/index.htm?category=Forester",
	"http://www.subaruoftampa.com/specials/index.htm?category=Impreza",
	"http://www.subaruoftampa.com/specials/index.htm?category=Tribeca",
	"http://www.subaruoftampa.com/specials/index.htm?category=Legacy",
	"http://www.subaruoftampa.com/specials/index.htm?category=Impreza+WRX"]
var bmw_urls = ["http://www.bmwsouthernoffers.com/Finance/leaseoffers.aspx?iframe=y"];

/* Le Program */

// empty the file before we begin
var file = path.join(__dirname, filename);
fs.unlink(file);
console.log("Writing data to " + file);

// run it
var audi_inserts = crawlDealerDotCom("audi", audi_urls, saveResults);
var subaru_inserts = crawlDealerDotCom("subaru", subaru_urls, saveResults)
var bmw_urls = crawlBMW("bmw", bmw_urls, saveResults)

function saveResults(results, brand) {

	for (var i in results) {
		// append data to the file asynchrously
		fs.appendFile(file, results[i] + "\n", function(err) {
		  if (err) throw err;
		});
	}
	console.log("-> Saved " + brand);
}

function crawlBMW(brand, urls, callback) {

	var results = []

	var c = new Crawler({
	    maxConnections: 10,
	    callback: function(error,result,$) {

	    	console.log("Got " + result.options.uri);

			$(".offer").each(function() {

				var img = $(this).find("img").attr("src")
				var headline = $(this).find("h4").text()
				var description = $(this).find("a").filter(function() {
					return $(this).css("display") === "block"
				}).text()

				headline = clean(headline)
				img = clean(img)
				description = clean(description)

				var insert = "INSERT INTO `specials` (`make`, `thumb`, `headline`, `description`, `leorder`) "
				insert += "VALUES ('" + brand + "', '', '"+  headline+ "', '" + description + "', NULL);"

				results.push(insert)

			})

	    },
	    onDrain: function() {
	    	callback(results, brand);
	    }
	})

	for (var i in urls) {
    	console.log("Loading " + urls[i])
		c.queue(urls[i])
	}

}


function crawlDealerDotCom(brand, urls, callback) {

	var results = []

	var c = new Crawler({
	    maxConnections: 10,
	    callback: function(error,result,$) {

	    	console.log("Got " + result.options.uri);

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

			var insert = "INSERT INTO `specials` (`make`, `thumb`, `headline`, `description`, `leorder`) "
			insert += "VALUES ('" + brand + "', '', '"+  headline+ "', '" + description + "', NULL);"

			results.push(insert)

	    },
	    onDrain: function() {
	    	callback(results, brand);
	    }
	})

	for (var i in urls) {
    	console.log("Loading " + urls[i])
		c.queue(urls[i])
	}

}

function clean(str) {
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, " ").replace(/\"/g, '\\\"').replace(/\'/g, '\\\'')
}
function strip(str) {
	// kills all whitespace
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, "")
}