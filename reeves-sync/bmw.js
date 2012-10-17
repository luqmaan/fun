
(function(){var a=document.createElement("script");a.src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js";a.type="text/javascript";document.getElementsByTagName("head")[0].appendChild(a)})()


var brand = "bmw";

var bmw_url = ["http://www.bmwsouthernoffers.com/Finance/leaseoffers.aspx?iframe=y"];

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
	insert += "VALUES ('"+ brand +"', '', '"+  headline+ "', '" + description + "', NULL);"

	console.log(insert);

})

function clean(str) {
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, " ")
}
