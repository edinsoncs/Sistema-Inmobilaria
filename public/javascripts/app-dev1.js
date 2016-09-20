$(document).ready(function(){

	///Date show in app	

		var fecha = function(data){
			var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
			var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
			var day = data.getDay();
			var month = data.getMonth();
			var year = data.getFullYear();
			var days = data.getDate();
			var isDay = '';
			var isMonth = '';
			
			for(var i = 0; i < dias.length; i++) {
				if(day == i) {
					isDay = dias[i];
				}
			}

			meses.map(function(resultado, index, t, total){
				if(month == index) {
					isMonth = resultado;
				}
			});

			var actuality = 'Hoy es: ' + isDay + ' ' + days + ' ' + isMonth + ' ' + ' del ' + year;

			$(".jsAddDate").text(actuality);
		}
		fecha(new Date());


	///End Data show in app


	///Show Menu User

		function showUserProfile(element) {
			$(".jsDownShow").on('click', function(){
				$(element).slideToggle()
			});
		}
		showUserProfile($(".jsDown"));

		function showUserProfileNotify(element) {
			$(".jsShowNotify").on('click', function(){
				$(element).slideToggle()
			});
		}
		showUserProfileNotify($(".jsDownNotify"));


	///En Menu User



	

});