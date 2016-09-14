$(document).ready(function(){

	//@buttons jquery create edinsoncs library
	$(".linkSave").flat('flat-t-cuatro');
	$(".propiedadesLink").flat('flat-t-dos');
	$(".submit").flat('flat-t-cuatro');
	$(".subirImg").flat('flat-t-dos');
	$(".saveEmail").flat('flattres');
	$(".viewServices").flat('flat-t-dos');

	$('input[name="fechaagenda"], input[name="ingresoinquilino"], input[name="finInquilino"], input[name="contratoInicio"], input[name="contratoFin"], input[name="isDateEntry"], input[name="isDateExit"], input[name="contratode"], input[name="contratohasta"]').dcalendarpicker({
		 format: 'dd-mm-yyyy'
	});

	$('.priceSum').dcalendarpicker({
			 format: 'dd-mm-yyyy'
		});
	



	//$("table").addSortWidget();


});