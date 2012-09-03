(function($, global) {


	/* Router */

	global.router = {
		init: function() {
			window.onhashchange = this.route;
			this.route();
		},
		get : function() {
			return window.location.hash.substr(2);
		},
		set : function(url) {
			window.location.hash = "!/" + url;
		},

		route : function() {

			var hash = router.get();

			$(".current.section").fadeOut();

			switch(hash) {
				case "/invite":
					inviteForm.init();
					break;
				case "/signup":
					mcForm.init();
					break;
				case "/thanks":
					sections.open($("#mc-results"));
					break;
				default:
					window.location.hash = "!/signup";
					break;
			}
		}

	};

	/* Mailchimp Form */
	var mcForm = {

		// open and set up mailchimp form
		init: function() {

			sections.open( $("#mc-signup") );

			helpers.autoClearInput($("input.email"), "Enter Email Address");

			$("#request-invite").on("click", function() {
				helpers.toggleElements($("#request-invite"), $("#email-entry"));
			});



			$('#email-entry').isHappy({
				submitButton: '#email-entry .submit',
				submitCallback: function() {
					$.ajax({
						type: 'POST',
						url: 'server/mcapi_listSubscribe.php',
						data: $("#email-entry").serialize(),
						success: function(data) {
							if (data.result === "success") {
								window.location.hash = "!/thanks";
								// _gaq.push(["_trackEvent","Landing", "Signup"]);
							} else {
								helpers.showAjaxError($("#email-entry"), "There was an error, try again", data.message);
							}
						},
						error: function(error) {
							console.log(error);
							helpers.showAjaxError($("#email-entry"), "There was an error, try again", error.responseText.message);
						}
					});
				},
				fields: {
					'#email-entry .email': {
						required: true,
						test: function(val) {
							return (/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/).test(val);
						},
						message: 'Invalid email'
					}
				},
				happyCallback: function() {
					$(this.submitButton).removeClass("error");
				},
				unhappyCallback: function(error) {
					$(this.submitButton).addClass("error");
				},
				when: 'propertychange input paste blur focus'

			});

		}

	};


	/* Invitation entry form */

	var inviteForm = {

		// set up and open invite form
		init: function() {

			sections.open($("#invite-entry"));

			helpers.autoClearInput($("input.invite"), "Enter Invitation Code");
			
			var _this = this;

			$('#invite-entry-form').isHappy({
				submitButton: '#invite-submit',
				submitCallback: function() {
					$.ajax({
						type: 'POST',
						url: 'server/invite_entry.php',
						data: $("#invite-entry-form").serialize(),
						success: function(data) {
							if (data.valid === "true") {
								$(".section.current h2").text("Valid");
							} else {
								if (!_this.alreadyFailed) {
									_this.alreadyFailed = true;
									$(".section.current h2").text("Denied");
									$(".section.current h4").text("We didn't recongize that invite").after("<br /><h4 class='cyan'>Try again?</h4>");
								}
								else {
									$(".section.current h2").text("Denied");
									$(".section.current h2").fadeOut(300).fadeIn(500);
								}
							}
						}
					});
				},
				fields: {
					'#invite-entry-form [name=code]': {
						required: true,
						test: function(val) {
							return (/[0-9]{5}/).test(val);
						},
						message: 'Invalid code'
					}
				},
				happyCallback: function() {
					$(this.submitButton).removeClass("error");
				},
				unhappyCallback: function(error) {
					$(this.submitButton).addClass("error");
				},
				when: 'propertychange input paste blur focus',
				alreadyFailed: false

			});

		}
	};


	/* helpers */

	// some miscellaneous helpers used internally
	var helpers = {

		// empty input when value is default
		autoClearInput : function ($selector, defaultVal) {
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

		},

		// display error message beneath input
		showAjaxError : function ($form, message) {
			var errorDetails = arguments[2] || undefined;
			if (errorDetails) {
				message = errorDetails;
			}
			$form.find(".error-message").empty().html(message);
		},

		// transition to new content
		toggleElements : function ($section1, $section2) {
			$section1.fadeOut(500, function() {
				$section2.fadeIn(1000);
			});
		}
	};

	/* sections */

	// used to open and close sections

	var sections = {

		open : function ($section) {

			var _this = this;

			// if a section is already open, close it first, only one section at a time
			if ($(".section.current").size() > 0) {
				this.close($(".section.current"), function() {
					_this.open( $section );
				});
			}
			else {
				$section.addClass("current").fadeIn(1000);
			}

		},
		// optional callback
		close: function($section) {

			var callback = arguments[1];

			$section.removeClass("current").fadeOut(500, function() {
				if (typeof callback === "function")
					callback();
			});
		}

	};



})(jQuery, window);
