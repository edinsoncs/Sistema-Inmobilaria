$(document).ready(function(){

	var element = $(".Services");
	var search = '.ServicesData';
	var stringEffect = 'effectoOne';

	var initializeHover = function(one, two, question) {
		$(one).hover(function(){
			var t = $(this).find(two);
			if(question == question) {
				$(this).find(two).fadeIn('slow');
				$(this).find('.Services--Top img:nth-child(2)').fadeOut('slow');
			} 
		}, function(){
			$(this).find(two).fadeOut('slow');
			$(this).find('.Services--Top img:nth-child(2)').fadeIn('slow')
		});
			
	};
	initializeHover(element, search, stringEffect);

	function slideDown(toClick) {
		$(toClick).click(function(){
			$(".dataShowInstalation").slideToggle();
		});
	} 
	slideDown($(".jsClickDown"));


});