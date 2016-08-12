//View Calendar.jade 

 function calendarEvent() {

        var elements = $(".calendarioEventos div");

        //@thisURL FORMAT ID
        var thisURL = window.location.pathname;
        var formatURL = thisURL.replace("/panel/propiedades/calendario/", "");

        /*if(thisURL == "/panel/propiedades/calendario/"+formatURL) {
            $('#calendario').eCalendar({
                url: 'http://localhost:3000/panel/propiedades/calendariojson/'+ formatURL
            });
        }
        else {
            return false
        }*/

        var isArray = [];

        for (var i = 0; i < elements.length; i++) {
            var month = $(elements[i]).attr('data-month');
            var dia = $(elements[i]).attr('data-dia');
            var year = $(elements[i]).attr('data-year');

            var thisTitle = $(elements[i]).attr('data-title');
            var thisDescription = $(elements[i]).attr('data-decription');

            var hora = $(elements[i]).attr('data-hora');
            var minutes = $(elements[i]).attr('data-minute');
            var obj = {
                title: thisTitle,
                description: thisDescription,
                datetime: new Date(year, month, dia, hora, minutes)
            }

            isArray.push(obj);
        }

        $('#calendario').eCalendar({
            events: isArray
        });

    }
    calendarEvent();