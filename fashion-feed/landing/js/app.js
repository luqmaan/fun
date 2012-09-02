(function() {


	autoClearInput ( $("input.invite"), "Enter Invitation Code");
	autoClearInput ( $("input.email"), "Enter Email Address");

	$("#request-invite").on("click", function() {
		toggleSections( $("#request-invite"), $("#email-entry") );
	});

	$("#email-entry .submit").on("click", function() {

				toggleSections( $("#mc-signup"), $("#mc-results") );


		$.ajax({
			type: 'POST',
			url: 'server/mcapi_listSubscribe.php',
			data: $("#email-entry .email").val(),
			success: function(data) {
				// _gaq.push(["_trackEvent","Landing", "Signup"]);
			},
			error: function() {
				// alert('asdf');
			}
		});
	});


	/* helpers */

	function autoClearInput($selector, defaultVal) {
		$selector.on("click", function() {
			var val = $(this).val();
			if (val === defaultVal) {
				$(this).val("");
			}
		});
		$selector.on("blur", function() {
			var val = $(this).val();
			if (val === "") {
				$(this).val(defaultVal);
			}
		});
		
	}
	
	function toggleSections ($section1, $section2) {
		$section1.fadeOut(500, function() {
			$section2.fadeIn(1000);
		});
	}


})(jQuery);
