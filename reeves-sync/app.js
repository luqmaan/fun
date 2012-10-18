console.log("hai")

var Crawler = require("crawler").Crawler
	fs = require('fs'),
	path = require('path'),
	scraper = require('./scraper'),
	config = require('./config')

// empty the file before we begin
var file = path.join(__dirname, config.filename)
fs.unlink(file)
console.log("Writing data to " + file)

// run it
//var audi_inserts = crawl("audi", config.audi_urls, scraper.dealerDotCom, saveResults)
//var subaru_inserts = crawl("subaru", config.subaru_urls, scraper.dealerDotCom, saveResults)
var bmw_urls = crawl("bmw", config.bmw_urls, scraper.bmw, saveResults)

/**
 * The crawler, queues the URLs and calls the scraper function
 * @param  {string}   brand     Will be used in the insert
 * @param  {array}   urls       List of URLs the specials are on.
 * @param  {Function} scrapeIt  The scraper function 
 * @param  {Function} callback  The save function 
 * @return {type}               Returns null, as this is asynchronous
 */
function crawl(brand, urls, scrapeIt, callback) {

	var results = []

	var c = new Crawler({
	    maxConnections: 10,
	    callback: function(error,result,$) {

			if (error) throw error

	    	console.log("Got " + result.options.uri)

	    	// extract the data
	    	var r = scrapeIt($,brand)

	    	for (var i in r)
		    	results.push(r[i]);

	    },
    	/** this acts like the return function of crawl() */
	    onDrain: function() {
	    	callback(results, brand)
	    }
	})

	// populate the crawler
	for (var i in urls) {
    	console.log("Loading " + urls[i])
		c.queue(urls[i])
	}

}

/**
 * Iterates through the results array and writes the inserts to the filesystem asynchronously.
 * @param  {array} results  Insert statements stored as strings in an array
 * @param  {string} brand   Yeah, its out of scope 
 * @return {null}           
 */
function saveResults(results, brand) {

	for (var i in results) {
		// append data to the file asynchrously
		fs.appendFile(file, results[i] + "\n", function(err) {
		  if (err) throw err
		})
	}
	console.log("-> Saved " + brand)
}
