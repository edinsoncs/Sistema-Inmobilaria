$(document).ready(function() {

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


    $("#thisUploadImage").change(function(e) {
        changeImage(this)
    });


    var changeImage = function(element) {
        var read = new FileReader();
        read.onload = function(e) {
            $(".fieldset--Form--Figure").css('background-image', 'url("' + e.target.result + '")');

        }
        read.readAsDataURL(element.files[0]);
    }

    function itemOptions(element) {

        $(element).on('click', function() {
            $(this).find('.jsShow').slideToggle('slow');
        });

    }
    itemOptions($(".jsClick"));




    /**
     *[functions] {return data website} 
     */

    function itemNone(element, noneItem, noneItemTwo) {
        $(element).click(function() {
            $(noneItem).css('display', 'none');
            $(noneItemTwo).fadeOut('slow');

        });
    }

    function itemShow(elemenTwo, showItem, showItemTwo) {
        $(elemenTwo).click(function() {
            $(showItem).fadeIn('slow');
            $(showItemTwo).fadeIn('slow');
        });
    }

    function pagoNone(pagoElement, pagoItem, pagoItemTwo) {
        $(pagoElement).click(function() {
            $(pagoItem).fadeIn('slow');
            $(pagoItemTwo).fadeIn('slow');
        });
        $(pagoItemTwo).click(function() {
            $(pagoItem).fadeOut('slow');
            $(pagoItemTwo).fadeOut('slow');
        });
    }

    function calendar(elementClick, elementShow) {
        $(elementClick).on('click', function() {

        });
    }


    function isDeletePropiedad(itemselect) {
        $(itemselect).on('click', function() {
            var deletePropiedadID = $(this).parent().parent().parent();
            var find = $(deletePropiedadID).attr('data-id');



            $.ajax({
                url: "./panel/deletepropiedad",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    id: find
                }),
                success: function(data) {
                    templateNotify('Se Removio La Propiedad')
                    setTimeout(function() {
                        window.location.href = "/panel/propiedades";
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

        var template = "<div class='NotifyContainer'>" +
            "<header class='NotifyContainer--Title'><h2 class='title'><i class='fa fa-exclamation' aria-hidden='true'></i>" +
            removeName + "</h2></header>" + "</div>";

        $("body").append(template).fadeIn('slow');
    }


    function cheked(inputCheck) {
        $(inputCheck).on('click', function() {
            if ($(this).is(":checked")) {
                var elemt = "input:checkbox[name='" + $(this).attr("name") + "']";
                $(elemt).prop('checked', false);
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        });
    }

    function printPropiedadDashboard() {
        $(".btn--Print").on('click', function() {
            window.print()
        });
    }
    printPropiedadDashboard();

    function showComments() {
        $(".jsShowComments").on('click', function() {
            var search = $(".dataMensaje");
            var element = $(this).siblings(search);
            $(element).fadeIn('slow');
        });
        $(".jsCloseComments").on('click', function() {
            $(this).parent().fadeOut('fast');
        });

    }
    showComments();

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


    function dowloadXLS() {
        $(".linkDownload").click(function() {
            var table = $(this).parent().parent();
            var down = $(table).find('#dataDown');

            $(".uNone").css('display', ' none;')

            window.open('data:application/vnd.ms-excel,' + $(down).html());
        });
    }
    dowloadXLS();

    function dialogs(type) {
        var _new = "<fieldset class='fieldset--Form tree'>"+
                    "<input type='date' name='contratoInicio'>"+
                    "</fieldset>"+
                    "<fieldset class='fieldset--Form tree'>"+
                    "<input type='date' name='contratoFin'>"+
                    "</fieldset>"+
                    "<fieldset class='fieldset--Form tree'>"+
                    "<input type='text' name='contratoFin' placeholder='$'>"+
                    "</fieldset>";


        if (type == 'click') {
            $(".jsDialogActive").click(function() {
                var input = $(this).parent();

                $.confirm({
                    title: 'Confirmación!',
                    content: 'Al aceptar usted esta creando un nuevo contrato de entrada y salida mas el monto mensual a pagar, esta seguro de proceder?',
                    confirm: function() {
                        disableBtn(input);
                        $(".appendNew").append(_new);
                        $.alert('Confirmed!');
                    },
                    cancel: function() {
                        $.alert('La cancelación a sido exitosa!')
                    }
                });
            
                function disableBtn(element){
                    var _input = $(element).find('input');
                    $(_input).attr('disabled','true');

                    $("input[name='contratoInicio']").attr('name', 'historyInicia');
                    $("input[name='contratoFin']").attr('name', 'historyFin');
                    $("input[name='precioMensual']").attr('name','historyMes')
                }

            });
        }
    }

    dialogs('click');


});
