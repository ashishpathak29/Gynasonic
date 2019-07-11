define([ "coreJS/adapt" ], function(Adapt) {

	var $body;
	var $el;
	var ids = [];
	var $document;


	function render() {
		$body = $("body");
		$el = $(Handlebars.templates.floatingmenu()).appendTo($body);
		checkZIndex();
		show();
		/*$document = $(".menu1").on("click", gotoPageID1);
		$document = $(".menu2").on("click", gotoPageID2);
		$document = $(".menu3").on("click", gotoPageID3);
		$document = $(".menu4").on("click", gotoPageID4);
		$document = $(".menu5").on("click", gotoPageID5);
		$document = $(".menu6").on("click", gotoPageID6);
		$document = $(".menu7").on("click", gotoPageID7);
		$document = $(".menu8").on("click", gotoPageID8);
		$document = $(".menu9").on("click", gotoPageID9);
		$document = $(".menu10").on("click", gotoPageID10);*/
	}

	function gotoPageID1(event)
	{
		Backbone.history.navigate('#/id/co-05-FM');
		//$(".floatingmenu-inner .menu1").addClass("floatingMenuButtonVisited");
	}
	
	function gotoPageID2(event)
	{
		Backbone.history.navigate('#/id/co-10-FM');
	}
	function gotoPageID3(event)
	{
		Backbone.history.navigate('#/id/co-15-FM');
	}
	function gotoPageID4(event)
	{
		Backbone.history.navigate('#/id/co-25-FM');
	}
	function gotoPageID5(event)
	{
		Backbone.history.navigate('#/id/co-30-FM');
	}
	function gotoPageID6(event)
	{
		Backbone.history.navigate('#/id/co-35-FM');
	}
	function gotoPageID7(event)
	{
		Backbone.history.navigate('#/id/co-40-FM');
	}
	function gotoPageID8(event)
	{
		Backbone.history.navigate('#/id/co-45-FM');
	}
	function gotoPageID9(event)
	{
		Backbone.history.navigate('#/id/co-50-FM');
	}
	function gotoPageID10(event)
	{
		Backbone.history.navigate('#/id/co-55-FM');
	}
	

	function show() {
		$el.velocity("fadeIn", 200, function() {
			
			Adapt.on("menuView:ready pageView:ready", checkZIndex);
		});
	}
	

	function checkZIndex() {
		var topZIndex = 0;
		var zIndex = parseInt($el.css("z-index"), 10) || 0;

		$body.find("*").not($el).each(function() {
			var i = parseInt($(this).css("z-index"), 10);

			if (i > topZIndex) topZIndex = i;
		});

		if (topZIndex !== 0 && topZIndex >= zIndex) $el.css("z-index", topZIndex + 1);
	}

	Adapt.once("app:dataReady", function() { if (!Adapt.device.touch) render(); });

});