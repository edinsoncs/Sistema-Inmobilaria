$(document).ready(function(){

	//
	var noneItemOne = $(".view--NotifyBG");
	var noneItemTwo = $(".view--Notify");
	var elementPrimary = $(".view--NotifyBG");

	//
	var elementSecondary = $(".btn--Notify");

	itemNone(elementPrimary, noneItemOne, noneItemTwo);
	itemShow(elementSecondary, noneItemOne, noneItemTwo);


	//

	var pagoElement = $(".btn--Ticket");
	var showItem = $(".view--Pagos");
	var showItemBG = $(".view--NotifyBG");

	//

	pagoNone(pagoElement, showItem, showItemBG);

	$("#thisUploadImage").change(function(e){
			changeImage(this)
	});
	

	var changeImage = function(element) {
		var read = new FileReader();
		read.onload = function(e) {
			$(".fieldset--Form--Figure").css('background-image', 'url("'+e.target.result+'")');
			
		}
		read.readAsDataURL(element.files[0]);
	}

	function itemOptions(element) {

		$(element).on('click', function(){
			$(this).find('.jsShow').slideToggle('slow');
		});

	}
	itemOptions($(".jsClick"));




	/**
	  *[functions] {return data website}	
	*/

	function itemNone(element, noneItem, noneItemTwo) {
		$(element).click(function(){
			$(noneItem).css('display','none');
			$(noneItemTwo).fadeOut('slow');

		});
	}

	function itemShow(elemenTwo, showItem, showItemTwo) {
		$(elemenTwo).click(function(){
			$(showItem).fadeIn('slow');
			$(showItemTwo).fadeIn('slow');
		});
	}

	function pagoNone(pagoElement, pagoItem, pagoItemTwo) {
		$(pagoElement).click(function(){
			$(pagoItem).fadeIn('slow');
			$(pagoItemTwo).fadeIn('slow');
		});
		$(pagoItemTwo).click(function(){
			$(pagoItem).fadeOut('slow');
			$(pagoItemTwo).fadeOut('slow');
		});
	}


	


});