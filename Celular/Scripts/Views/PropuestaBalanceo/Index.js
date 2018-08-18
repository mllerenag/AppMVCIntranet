let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;
$(document).ready(function () {
    ActualizarInicio();
    inicializarPagina();
});

function inicializarPagina(){
    var url_ = $("#UrlServicio").val() + '/api/portafolio/obtenerDatos';
    var entidad_ = { codigo_portafolio: $("#id_portafolio").val()}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if (resultado != null) {
                DatosPortafolio(resultado.datos);
                SolicitudesPortafolio(resultado.solicitudes);
                RecursosPortafolio(resultado.recursos);
            }

        },
        error: function (xhr, status, error) {
            alert('Ocurrio un error');
        }
    });
}

function DatosPortafolio(res){

    $("#lblNombre").text(res.no_nombre);
    $("#lblPrioridad").text(res.no_prioridad);
    $("#lblEstado").text(res.no_estado);
    $("#lblResponsable").text(res.no_responsable);
    $("#lblDescrpcion").text(res.tx_descripcion);

}

function RevalidateRecomendada(res, recursos){

    var rectmp = recursos;
    var arraytmp = new Array();
    var numero = 0;
    for(var x = 0; x < rectmp.length; x++){
        for( y = 0; y < res.length; y++){
            if(rectmp[x].no_recurso == res[y].no_recurso){
                numero += res[y].nu_solicitado;
            }
        }

        if(numero < res.nu_recursodisponible){
            for( y = 0; y < res.length; y++){
                if(rectmp[x].no_recurso == res[y].no_recurso){
                    res[y].no_recomendado = res[y].nu_solicitado;
                    rectmp[x].validado = true;
                }
            }
        }
    }

}
/*
function RevalidateRecomendada(res, recursos)
{
    var array = new Array();
    //Alta Recibe Todo
    //Media Recibo Todo - 1
    //Baja Recibe 1
    for(var x = 0; x < res.length; x++)
    {
        if(res.no_prioridad == "Alta")
        {
            array.push( { recomendar : res[x].nu_solicitado , objeto : res[x] });
        }
        else if (res.no_prioridad == "Media")
        {
            if(res[x].nu_solicitado > 1){
                array.push( { recomendar : (res[x].nu_solicitado - 1) , objeto : res[x] });
            }
            else{
                array.push( { recomendar : 1 , objeto : res[x] });
            }
        }else{
            array.push( { recomendar : 1 , objeto : res[x] });
        }
    }
    var continuar = true;
    for ( x = 0; x < array.length; x++){
        continuar = true;
        while(continuar){
            if(array[x].objeto.nu_recursodisponible < array[x].objeto.recomendar){
                if(array[X].objeto.recomendar > 1){
                    array[x].objeto.recomendar--;
                }else{
                    continuar = false;
                }
            }else{
                continuar = false;
            }
        }
    }
    continuar = false;
    var cantidad = 0;
    var corridascorrectas = 0;
    var intentos = 0;
    while(continuar){
        for( x = 0; x < recursos.length; x++){
            for(y = 0; y < array.length; y++){
                if(recursos[x].no_recurso == array[y].objeto.no_recurso){
                    cantidad += array[y].recomendar;
                }
            }

            if(cantidad > recursos[x].nu_recursodisponible)
            {
                for(y = 0; y < array.length; y++){
                    if(recursos[x].no_recurso == array[y].objeto.no_recurso){
                        if(array[y].recomendar >= 1)
                        {
                            array[y].recomendar--;
                        }else if(intento > 2 && array[y].no_prioridad == "Baja" && array[y].recomendar == 1){
                            array[y].recomendar = 0;
                        }else if(intento > 4 && array[y].no_prioridad == "Media" && array[y].recomendar == 1){
                            array[y].recomendar = 0;
                        }
                        else if(intento > 6 && array[y].no_prioridad == "Alta" && array[y].recomendar == 1){
                            array[y].recomendar = 0;
                        }
                    }
                }
            }else{
                corridascorrectas++;
            }
            cantidad = 0;
        }
        corridascorrectas = 0;
        intentos++;
        if(intentos > 10)
            continuar = false;
        if(corridascorrectas == recursos.length)
            continuar = false;
    }

    return array;
}
*/

function SolicitudesPortafolio(res){
    var retorno = '<table id="tbl_Portafolios" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Fecha Emisión</th>';
    retorno += '<th>Componente</th>';
    retorno += '<th>Prioridad Componente</th>';
    retorno += '<th>Tipo de Solicitud</th>';
    retorno += '<th>Recurso</th>';
    retorno += '<th>Cantidad Solicitada</th>';
    retorno += '<th>Cantidad Disponible</th>';
    retorno += '<th>Cantidad por Asignar</th>';
    retorno += '<th>Cantidad Actual</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    var tabindex = 1001;
    if(res.length == 0){
        document.getElementById("drSolicitudes").style.display = 'none';
    }
    for(var x= 0; x < res.length; x++){
        retorno += '<tr>';
        retorno += '<td>' + res[x].co_solicitud + '<input class="form-control" type="hidden" id="vl_hf' + tabindex +'" value="' + res[x].nid_solicitud + '" />'+ '</td>';
        tabindex++;
        retorno += '<td>' + res[x].fe_solicitud + '</td>';
        retorno += '<td>' + res[x].no_componente + '</td>';
        retorno += '<td>' + res[x].no_prioridad + '</td>';
        retorno += '<td>' + res[x].no_tipo_recurso + '</td>';
        retorno += '<td>' + res[x].no_recurso + '</td>';
        retorno += '<td>' + res[x].nu_solicitado + '</td>';
        retorno += '<td>' + res[x].nu_recursodisponible + '</td>';
        retorno += '<td><input class="form-control" type="text" maxlenght="2" onkeypress="return SoloNumerico(event);" id="vl_txt' + tabindex +'" value="' + res[x].nu_recomendado + '"/></td>';
        retorno += '<td>' + res[x].nu_recursototal + '</td>';
        retorno += '</tr>';
        tabindex++;
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvTablaSolicitudes").html(retorno);

    
    setTimeout( function(){
        $("#tbl_Portafolios").dataTable({
            'paging'      : true,
            'lengthChange': true,
            'searching'   : true,
            'ordering'    : true,
            'info'        : true,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    },500);
}

function grabarBalanceo(){
    $("#myModal1").modal('show');
}
function cerrarPopUp(){
    $("#myModal1").modal('hide');
}
function redirigirInicio(){
    window.location.href = './SeleccionPortafolio';
}

function iniciarBalanceo(){
    var datos = Recupera_Datos("dvTablaSolicitudes");
    for(var x= 0; x < datos.length; x++){
        if(x % 2 == 1){
            if(datos[x].trim() == ""){
                fc_MsjError('005 - No hay recursos asignados');
                cerrarPopUp();
                return;
            }
        }
    }
    var entidad_ = { lista_parametros: datos , portafolio : $("#id_portafolio").val() , id_user : $("#id_usuario").val() };
    var url_ = $("#UrlServicio").val() + '/api/portafolio/realizarBalanceo';
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if (resultado != null) {
                cerrarPopUp();
                if(resultado.resultado == 0){
                    fc_MsjError('004 - ' + resultado.mensaje);       
                }else{
                    fc_MsjSuccess(resultado.mensaje);
                    setTimeout( function(){ window.location.href = './SeleccionPortafolio'}, 3000);
                }
            }

        },
        error: function (xhr, status, error) {
            cerrarPopUp();
            fc_MsjError('001 - Ocurrio un error');
        }
    });


}

function Recupera_Datos(div,extra) {
    var parametros = new Array();
    var prm_text = "";
    if (div != "") {
        var tagname = new Array('input', 'div', 'textarea', 'select'), id_items = [], doc = document.getElementById(div), b, count, _prm = "";
        for (var i = 0; i < 4; i++) {
            b = doc.getElementsByTagName(tagname[i]);
            count = b.length;
            for (var j = 0; j < count; j++) {
                if (b[j].id.startsWith('vl_'))
                    if(!(tagname[i] == 'div' && b[j].id.endsWith('_chosen'))){
                        id_items.push(b[j]);
                    }
            }
        }
        id_items.sort(OrderByTabIndex);
        count = id_items.length;
        for (var i = 0; i < count; i++){
            parametros.push(Recupera_Datos_Item(id_items[i]));    
        }
    }

    if(extra != undefined){
        if(extra != ""){
            var extra_params = extra.split('|');
            for (var i = 0; i < extra_params.length; i++){
                parametros.push(extra_params[i]);
            }
        }
    }
    return parametros;
    
}

function OrderByTabIndex(a, b) { if (a.tabIndex > b.tabIndex) return 1; else if (a.tabIndex < b.tabIndex) return -1; else return 0; }


function Recupera_Datos_Item(id_filtro) {
    switch (id_filtro.type) {
       
        case "checkbox": 
            if (id_filtro.checked) { return '1|' + id_filtro.value } else { return  '0|' + id_filtro.value }
        case "radio": 
            if (id_filtro.checked) { return '1|' + id_filtro.value } else { return '0|' + id_filtro.value }
        case undefined : return id_filtro.innerHTML;
        default:
            return id_filtro.value;
    }
}


function RecursosPortafolio(res){
    var retorno = '<table id="tbl_Recursos" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Tipo de Recurso</th>';
    retorno += '<th>Cantidad Total</th>';
    retorno += '<th>Cantidad en Uso</th>';
    retorno += '<th>Cantidad Separado</th>';
    retorno += '<th>Cantidad Disponible</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    var tabindex = 1001;
    for(var x= 0; x < res.length; x++){
        retorno += '<tr>';
        retorno += '<td>' + res[x].no_nombre + '</td>';
        retorno += '<td>' + res[x].nu_recursototal + '</td>';
        retorno += '<td>' + res[x].nu_recursoconsumido + '</td>';
        retorno += '<td>' + res[x].nu_separado + '</td>';
        retorno += '<td>' + res[x].nu_recursodisponible + '</td>';
        retorno += '</tr>';
        tabindex++;
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvTablaRecursos").html(retorno);

    
    setTimeout( function(){
        $("#tbl_Recursos").dataTable({
            'paging'      : true,
            'lengthChange': true,
            'searching'   : true,
            'ordering'    : true,
            'info'        : true,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            }
        });
    },500);
}
