"use strict";


module.exports = (req, res, next, type) => {
    
    if(type == 'success') {
    	type = 'Completado';
    } 
    
    else if(type == 'failure'){
    	 type = 'Fallo';
    } 

    else if(type == 'pending'){
    	 type = 'Pendiente';
    }
    else {
    	 type = 'Intente nuevamente';
    }

    res.render('mercadopago', {
        user: req.user,
        cuenta: req.user.cuenta,
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        menu: 'Inicio',
        serv: req.user.propiedades,
        foto: req.user.foto,
        disponibles: req.user.propiedadesDisponibles,
        agenda: req.user.agenda,
        description: type
    });
}
