function fc_MsjSuccess(msj) {

    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000,
    };
    toastr.success(msj, 'Indra');
}

function fc_MsjError(msj) {

    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000,
    };
    toastr.error(msj, 'Indra');
}

function fc_MsjWarning(msj) {

    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000,
    };
    toastr.warning(msj, 'Indra');
}

function ActualizarInicio() {
    var nombre = $("#nom_usuario").val();
    var idperfil = $("#id_perfil").val();
    $("#txtNombreUsuario").html(nombre);
    $("#txtNombreUsuario2").html(nombre);

    if (idperfil == "1") {
        document.getElementById("li_1").style.display = '';
        document.getElementById("li_2").style.display = 'none';
    } else {
        document.getElementById("li_1").style.display = 'none';
        document.getElementById("li_2").style.display = '';
    }
}

function SoloNumerico(eventObj) {
    /*var tecla = (document.all) ? e.keyCode : e.which; var patron = /^[0-9]*$/; te = String.fromCharCode(tecla); if (!patron.test(te)) { (document.all) ? e.keyCode = 0 : e.which = 0; return false; } else return true; */
    var key;
    if (eventObj.keyCode)            // For IE
        key = eventObj.keyCode;
    else if (eventObj.Which)
        key = eventObj.Which;       // For FireFox
    else
        key = eventObj.charCode;    // Other Browser              

    if (key >= 48 && key <= 57) { }
    else if (key == 8 || key == 9 || key == 37) { }
    else {
        return false;
    }

}