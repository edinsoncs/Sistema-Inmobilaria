$(document).ready(function() {

    //
    var sum = 1;
    var soom = 569;

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
    var isDisponible = $(".jsDeleteDisponible");
    var deleteTicket = $(".deleteTicket");

    //
    deleteTicketSupport(deleteTicket);
    isDeletePropiedad(deletePropiedad);
    isDeletePropiedadDisponible(isDisponible);

    //

    //
    var inputChecked = $("input[type='checkbox']");
    cheked(inputChecked);


    //

    //

    var mobileSelect = $(".jsClickMobil");
    mobilMenu(mobileSelect);


    //

    //

    var register = $("select[name='typeaccount']");
    thisRegister(register);

    var print = $(".jsClickPrint");
    printActiveClick(print);


    //

    //

    var removePriceSelector = $(".listPrecios--Remove");
    removePrice(removePriceSelector);

    removePriceViewEdit($(".jsDeleteOneEdit"));

    addPriceViewEdit($(".jsSumEditOne"));


    tabAgenda($(".jsAgendaLink"));

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

    function isDeletePropiedadDisponible(itemSelect) {
        $(itemSelect).click(function() {
            var deletePropiedadID = $(this).parent().parent().parent();
            var find = $(deletePropiedadID).attr('data-id');

            $.ajax({
                url: "./panel/deletedisponible",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    id: find
                }),
                success: function(data) {
                    templateNotify('Se Removio La Propiedad');
                    setTimeout(function() {
                        window.location.href = "/panel/disponibles";
                    }, 1000);
                },
                error: function(err) {
                    console.log(err);
                }
            });

        });
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



    function downHTMLFN(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }


    function dowloadXLS() {
        $(".linkDownload").click(function() {
            var table = $(this).parent().parent();
            var down = $(table).find('#dataDown').html();
            var titlePropiedad = $(".view--Iz--Top .title").text();
            $(".uNone").css('display', ' none;')
            var fileHTML = "<body>" + down + "</body>";


            downHTMLFN("data:text/html, '" + fileHTML + "'", titlePropiedad + '.html');

            return false;

        });
    }
    dowloadXLS();

    function dialogs(type) {
        var _new = "<fieldset class='fieldset--Form tree'>" +
            "<input type='hidden' name='newContrato'>" +
            "<input type='text' name='contratoInicio'>" +
            "</fieldset>" +
            "<fieldset class='fieldset--Form tree'>" +
            "<input type='text' name='contratoFin'>" +
            "</fieldset>" +
            "<fieldset class='fieldset--Form tree'>" +
            "<input type='text' name='precioMensual' placeholder='$'>" +
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


                        $("input[name='contratoInicio'], input[name='contratoFin']").dcalendarpicker({
                            format: 'dd-mm-yyyy'
                        });
                    },
                    cancel: function() {
                        $.alert('La cancelación a sido exitosa!')
                    }
                });

                function disableBtn(element) {
                    var _input = $(element).find('input');
                    $(_input).attr('disabled', 'true');

                    $("input[name='contratoInicio']").attr('name', 'historyInicia');
                    $("input[name='contratoFin']").attr('name', 'historyFin');
                    $("input[name='precioMensual']").attr('name', 'historyMes')
                }

            });
        }
    }

    dialogs('click');

    $(".jsClickZoom").click(function() {
        var img = $(this).siblings('.Options--Iz');
        var imgshow = $(img).find('a');


        var modalBox = "<section class='modalbox--Show'>" +
            "<figure class='modalbox--Show---Figure'>" +
            thisimg(imgshow) +
            "<div class='modalbox--Close'><button class='itemClose'>Cerrar</button></div>" +
            "</figure>" +
            "</section>";

        var closeBox = $(".itemClose");
        var remove = $(".modalbox--Show");

        insertAppend(modalBox, remove);

    });

    function thisimg(img, close) {
        var n = $(img).attr('href');

        var searching = n.search('jpg');
        var searchingOther = n.search('png');

        if (searching > 0 || searchingOther > 0) {
            var img = "<img src='" + n + "' alt='' class='img'>";
            return img;
        } else {
            var pdf = "<object data='" + n + "' type='application/pdf', width='100%' height='450px'></object>"
            return pdf
        }

    }

    function insertAppend(html, remove) {
        $("body").append(html);

        $(".itemClose").click(function() {
            $(".modalbox--Show").remove();
        });
    }

    $(".jsClickDelete").click(function() {
    	var _remove = $(this).parent().parent();
        var id = $(this).parent().parent();
        var id_show = $(id).attr('data-id');

        $.ajax({
            url: '../../deletemultimediaservice',
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                idremove: id_show
            }),
            success: function() {
            	$(_remove).remove();
            },
            error: function(err) {
                console.log(err);
            }
        });

    });


    function deleteTicketSupport(element) {
        $(element).click(function(e) {
            var id = $(this).attr('data-id');
            $.ajax({
                url: '../../deleteticket',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    idremove: id
                }),
                success: function(data) {
                    templateNotify('Se Removio El Ticket')
                    setTimeout(function() {
                        window.location.href = '../support';
                    }, 1000);
                },
                error: function(err) {
                    return err;
                }
            });
        });
    }

    function mobilMenu(element) {

        $(element).click(function() {
            var show = $(".Mobil--Sub").slideToggle('slow');
            var i = $(this).find('i');
            $(i).attr('class', 'fa fa-times-circle');

            verify(show, i);
        });

        function verify(ele, z) {
            if ($(ele).is(":hidden")) {
                console.log('hola');
            } else {
                console.log('g');
                $(z).attr('class', 'fa fa-bars');
            }
        }
    }

    function printActiveClick(element) {

        $(element).click(function() {

            var empresa = $(this).siblings('.jsEntreprise').text();
            var nombre = $(this).siblings('.jsInquilino').text();;
            var precio = $(this).siblings('.jsPayment').text();
            var monthPayment = $(this).siblings('.jsMonthPayment').text();
            var nombreProperti = $(this).siblings('.jsNameProperti').text();
            var fecha = $(this).siblings('.jsMonth').text();
            var id = Math.random();

            var img = $(".header__UserFigure img").attr('src');


            var nameAdminProperti = $(".header__ShowData span").text();

            var themePrint = "<div class='toPrint__BG'></div>" +
                "<section class='toPrint__Container'>" +
                "<section class='toPrint__Container--Header'>" +
                "<article class='Header--Iz'>" +
                "<figure class='Header--Figure'>" +
                "<img src='" + img + "' alt=''>" + "</figure>" +
                "<div class='Header--Description'>" +
                "<h2 class='title'>" +
                empresa + "</h2>" +
                "</div>" + "</article>" +
                "<article class='Header--De'>" +
                "<header class='Header--De--Header'>" +
                "<span class='title'>Recibo:</h2>" +
                "<span class='title'>(Documento no válido como factura)</span>" + "</header>" +
                "<div class='Sub'>" +
                "<h3 class='SubThis'>Nº: " + id.toFixed(3).replace('.', '-') + "</h3>" +
                "</div>" +
                "<div class='Date'>" +
                "<h3 class='title'>Fecha: " + fecha + "</h3>" + "</div>" +
                "</article>" + "</section>" +
                "<section class='toPrint__Show'>" +
                "<p>Recibi de: <strong>" + nombre + " .........................................................................................................................................................................................................................................................................................................................................................<br/>..........................................................................................................................................................................................................................................................................................................................................................</strong></p>" +
                "<p>Recibí la suma de pesos: <strong>" + precio + " ................................................................................................................................................................................................................................................................................................................................................................................<br/>..............................................................................................................................................................................................................................................................................................................................................................</strong></p>" +
                "<p>Correspondiente al alquiler del mes de: <strong>" + monthPayment + " ............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................</strong></p>" +
                "<p>De la propiedad: <strong>" + nombreProperti + " ..............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................</strong></p>" +
                "<p>por cuenta y orden de: <strong>" + nameAdminProperti + " ...........................................................................</strong></p>" +
                "</section>" +
                "<section class='toPrint__Show'>" +
                "<p>Observaciones: <strong>..............................................................................................................................................................................................................................................................................................................................................................<br/>.....................................................................................................................................................................................................................................................................................................................................................................................................................<br/>......................................................................................................................................................................................................................................................................................................................................................................................................................<br/>.......................................................................................................................................................................................................................................................................................................................................................................................................................<br/></strong></p>" +
                "</section>" +
                "<section class='toPrint__Show'>" +
                "<p>CON CHEQUE Nº: ..........................................................................................................................................................................................................................................................................................................................................................................................</br>..........................................................................................................................................................................................................................................................................................................................................................................................................................</strong></p>" +
                "<div class='toPrint__Show--Details'>" +
                "<ul class='to__Ul'>" +
                "<li class='list'>Fecha de Emisión: <b>.............................</b></li>" +
                "<li class='list'>Fecha Vto: <b>....................................</b></li>" +
                "<li class='list'>Banco: <b>................................</b></li>" + "</ul>" + "</div>" +
                "<div class='toPrint__Options--Details'>" +
                "<div class='Details--Iz'><span class='title'>TOTAL $: " + precio + "<b>..........................</b></span></div>" +
                "<div class='Details--De'><span class='title'>Firma y aclaracion: <b>.........................</b></span></div>" + "</div>" +
                "</section>" +
                "<section class='toPrint__Show--Close'>" +
                "<span class='delete jsClosePrint'>Cerrar</span>" + "</section>" + "</section>";

            $("body").append(themePrint);

            activeDeletePrint($(".jsClosePrint"));

            setTimeout(function() {
                window.print();
            }, 500);

        });

        function activeDeletePrint(element) {
            $(element).click(function() {
                var thisSibling = $(this).parent().parent();
                var brotherDelete = $(thisSibling).siblings('.toPrint__BG');
                var thisDelete = $(this).parent().parent();

                $(thisDelete).remove();
                $(brotherDelete).remove();
            });

            $("body").keyup(function(e) {

                if (e.keyCode == 27) {
                    $(".toPrint__BG").remove();
                    $(".toPrint__Container").remove();
                }

            });
        }


    }

    function thisRegister(select) {

        //Select HTML
        $(select).change(function() {
            //Option 
            $("select[name='typeaccount'] option:selected").each(function() {
                var show = this;
                verifyOption(this.value, show);
            });
        });

        function verifyOption(val, state) {
            if (val == 3 || val == 6 || val == 12) {
                var paymentCheck = "<select name='typepayment'>" +
                    "<option value='false'>Deposito</option>" +
                    "<option value='true'>MercadoPago</option>" +
                    "</select>";

                var addingPayment = $(state).parent().parent();

                //Insert Payment
                $(".jsAdding").html(paymentCheck);

            } else {
                //Verify item adding remove return = true

                $(".jsAdding").html('');

            }
        }

    }







    $(".jsSum").click(function() {
        var _numberID = sum++;
        var _theme = '';
        _theme += "<div class='form--Container jsAppendDates'>" +
            "<input type='hidden' name='price[" + _numberID + "][id]' value=" + _numberID + ">" +
            "<fieldset class='fieldset--Form tree'><input class='priceSum' type='text' placeholder='De' name='price[" + _numberID + "][preciodesde]'></fieldset>" +
            "<fieldset class='fieldset--Form tree'><input class='priceSum' type='text' placeholder='Hasta' name='price[" + _numberID + "][preciohasta]'></fieldset>" +
            "<fieldset class='fieldset--Form tree'><input type='text' placeholder='Precio' name='price[" + _numberID + "][precio]'></fieldset>" +
            "<fieldset class='fieldset--Form tree'><span class='delete jsDeleteOne'>-</span></fieldset>" +
            "</div>";
        $(".jsAppendDates:last-child").after(_theme);

        $('.priceSum').dcalendarpicker({
            format: 'dd-mm-yyyy'
        });


        var _delete = $(".jsDeleteOne");

        removeItemAddProperti(_delete);
    });



    function removePrice(selector) {
        $(selector).click(function() {
            var _elementparent = $(this).parent();
            var _idremove = $(_elementparent).attr('data-id');

            $.ajax({
                url: '../../panel/deleteprice',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    id: _idremove
                }),
                success: function(data) {
                    templateNotify('Se Removio el precio');
                    $(element).remove();

                    setTimeout(function() {
                        window.location.reload();
                    }, 2000);

                },
                error: function(err) {
                    console.log(err);
                }
            })

        });
    }

    function removePriceViewEdit(element) {

        $(element).click(function() {
            var _remove = $(this).parent().parent();
            $(_remove).remove();
        });

    }

    function addPriceViewEdit(element) {
        $(element).click(function() {
            var _numberID = soom++;
            var _theme = '';
            _theme += "<div class='form--Container jsAppendDatesEdit'>" +
                "<input type='hidden' name='price[" + _numberID + "][id]' value=" + _numberID + ">" +
                "<fieldset class='fieldset--Form tree'><input class='priceSum' type='text' placeholder='De' name='price[" + _numberID + "][preciodesde]'></fieldset>" +
                "<fieldset class='fieldset--Form tree'><input class='priceSum' type='text' placeholder='Hasta' name='price[" + _numberID + "][preciohasta]'></fieldset>" +
                "<fieldset class='fieldset--Form tree'><input type='text' placeholder='Precio' name='price[" + _numberID + "][precio]'></fieldset>" +
                "<fieldset class='fieldset--Form tree'><span class='delete jsDeleteOneEdit'>-</span></fieldset>" +
                "</div>";
            $(".jsAppendDatesEdit:last-child").after(_theme);

            $('.priceSum').dcalendarpicker({
                format: 'dd-mm-yyyy'
            });

            var _delete = $(".jsDeleteOneEdit");

            removeItemAddProperti(_delete);

        });
    }

    function templateNotify(removeName) {

        var template = "<div class='NotifyContainer'>" +
            "<header class='NotifyContainer--Title'><h2 class='title'><i class='fa fa-exclamation' aria-hidden='true'></i>" +
            removeName + "</h2></header>" + "</div>";

        $("body").append(template).fadeIn('slow');
    }

    function removeItemAddProperti(item) {
        $(item).click(function() {
            var _remove = $(this).parent().parent();
            $(_remove).remove();
        });
    }

    function tabAgenda(element) {
        $(element).on('click', function() {
            _isHref = $(this).attr('href');
            _isHash = window.location.hash;

            window.location.reload();

        });
    }

    function fnTabView() {
        var verifyHash = window.location.hash;

        var obj = {
            uno: $(".containerTabs__Agenda"),
            dos: $(".containerTabs__Contratos"),
            tres: $(".containerTabs__VencimientoContratos"),
            cuatro: $(".containerTabs__VencimientosPrecios"),
            cinco: $(".containerTabs__VencimientoInquilino")
        }

        switch (verifyHash) {
            case '#propiedades':
                $(obj.dos, obj.tres, obj.cuatro, obj.cinco).css('display', 'none');
                $(obj.uno).fadeIn('slow');
                $(".agendaTabs__List:nth-child(1) a").addClass('selectItemAgend')
                $(".agendaTabs__List:nth-child(1) a").addClass('selectItemAgend')
                break;
            case '#contratos':
                $(obj.uno, obj.tres, obj.cuatro, obj.cinco).css('display', 'none');
                $(obj.dos).fadeIn('slow');
                $(".agendaTabs__List:nth-child(2) a").addClass('selectItemAgend')
                button($(".propiedadesLink"));
                break;
            case '#vencimientoscontratos':
                $(obj.uno, obj.dos, obj.cuatro, obj.cinco).css('display', 'none');
                $(obj.tres).fadeIn('slow');
                $(".agendaTabs__List:nth-child(3) a").addClass('selectItemAgend')
                button($(".propiedadesLink"));
                break;
            case '#vencimientosprecios':
                $(obj.uno, obj.dos, obj.tres, obj.cinco).css('display', 'none');
                $(obj.cuatro).fadeIn('slow');
                $(".agendaTabs__List:nth-child(4) a").addClass('selectItemAgend')
                button($(".propiedadesLink"));
                break;
            case '#vencimientoinquilino':
                $(obj.uno, obj.dos, obj.tres, obj.cuatro).css('display', 'none');
                $(obj.cinco).fadeIn('slow');
                $(".agendaTabs__List:nth-child(5) a").addClass('selectItemAgend')
                button($(".propiedadesLink"));
                break;
            default:
                //alert('error');
        }

        function button(btn) {
            $(btn).remove();
        }
    }

    fnTabView();

    function activeNotify() {

        var _one = $(".activeNewNotify").parent().parent();
        var _two = $(_one).siblings('.header__ShowNotify');
        $(_two).addClass('notifyLoop');
    }

    activeNotify();

    function paymentUser() {

        $(".linkPayment").click(function() {
            $.ajax({
                url: 'paymentuser',
                type: 'POST',
                success: function(data) {
                    console.log(data);
                    var _url = data.mlData.response.init_point;
                    var _browser = 'toolbar=no, location=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, width=1000px, height=750px, left=225px, top=300, scrollbars=yes';
                    window.open(_url, 'Zimba - Payment Mercadopago', _browser);
                }
            });
        });

    }
    paymentUser();

});
