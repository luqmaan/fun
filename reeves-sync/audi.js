
(function(){var a=document.createElement("script");a.src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js";a.type="text/javascript";document.getElementsByTagName("head")[0].appendChild(a)})();

var headline = $(".dsbTitle").text().replace(/\n/g;
var price = $(".dsbPriceCont").text();
var details = $(".dsbCont").html();

headline = clean(headline);
price = clean(price);
details = clean(details);

var description = price + "<br />" + details;

var insert = "INSERT INTO `specials` (`make`, `thumb`, `headline`, `description`, `leorder`) ";
insert += "VALUES ('audi', '', '"+  headline+ "', '" + description + "', NULL);";

function clean(str) {
	return str.replace(/\&nbsp;/g, "").replace(/[\s\n]+/g, " ");
}