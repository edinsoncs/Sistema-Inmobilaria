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


	//
	var deletePropiedad = $(".jsDelete");


	//
	isDeletePropiedad(deletePropiedad);

	//

	//
	var inputChecked = $("input[type='checkbox']");
	cheked(inputChecked);


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

	function calendar(elementClick, elementShow) {
		$(elementClick).on('click', function(){

		});
	}


	function isDeletePropiedad(itemselect) {
		$(itemselect).on('click', function(){
			var deletePropiedadID = $(this).parent().parent().parent();
			var find = $(deletePropiedadID).attr('data-id');
			console.log(find)
			
			$.ajax({
				url: "deletepropiedad",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({
					id: find
				}),
				success: function(data) {
					templateNotify('Se Removio La Propiedad')
					setTimeout(function(){
						window.location.href ="/panel/propiedades";
					}, 1000);
					//
				},
				error: function(err) {
					alert('paaso un error');
				}
			});


		});
	} 


	function templateNotify(removeName) {

		var template = "<div class='NotifyContainer'>"+
							"<header class='NotifyContainer--Title'><h2 class='title'><i class='fa fa-exclamation' aria-hidden='true'></i>"+
								removeName
							+"</h2></header>"
						+"</div>";

		$("body").append(template).fadeIn('slow');
	}


	function cheked(inputCheck) {
		$(inputCheck).on('click', function(){
			if($(this).is(":checked")) {
				var elemt = "input:checkbox[name='" + $(this).attr("name") + "']";				
				$(elemt).prop('checked', false);
				$(this).prop('checked', true);
			} else {
				$(this).prop('checked', false);
			}
		});
	}

	function printPropiedadDashboard() {
		$(".btn--Print").on('click', function(){
			window.print()
		});
	}
	printPropiedadDashboard();

	function showComments() {
		$(".jsShowComments").on('click', function(){
			var search = $(".dataMensaje");
			var element = $(this).siblings(search);
			$(element).fadeIn('slow');
		});
		$(".jsCloseComments").on('click', function(){
			$(this).parent().fadeOut('fast');
		});

	}
	showComments();


});