$(document).ready(function(){

	
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




});