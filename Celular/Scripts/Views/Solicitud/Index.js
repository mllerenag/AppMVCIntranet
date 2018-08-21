let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;
var array_solicitudes_tmp = new Array();
var nid_solicitud = 0;
var nid_relacion_proyecto = 0;

$(document).ready(function () {
    var nombre = $("#nom_usuario").val();
    ActualizarInicio();
    $('.dtpicker').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    })

    cargarFiltros();
    buscarSolicitudes();
    
});

function cargarFiltros(){

    var url_ = $("#UrlServicio").val() + '/api/Solicitud/CargarFiltroGestion';
    var entidad_ = null;
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            Combo_Recurso(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function Combo_Recurso(objeto){
    $("#vl_Recurso").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#vl_Recurso").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });
}

function buscarSolicitudes(){
    var retorno = '<table id="tbl_Solicitudes" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Cod Solicitud</th>';
    retorno += '<th>Solicitud</th>';
    retorno += '<th>Componente</th>';
    retorno += '<th>Portafolio</th>';
    retorno += '<th>Fecha Solicitud</th>';
    retorno += '<th>Cant. Soli</th>';
    retorno += '<th>Recurso</th>';
    retorno += '<th>Estado</th>';
    retorno += '<th style="min-width:130px">Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';

    var codigo = $("#vl_txtSolicitud").val();
    var recurso = $("#vl_Recurso").val();
    var portafolio =$("#vl_txtPortafolio").val();
    var componente = $("#vl_txtComponente").val();

    var url_ = $("#UrlServicio").val() + '/api/solicitud/BuscarSolicitudes';
    var entidad_ = { codigo: codigo, recurso : recurso, portafolio : portafolio, componente : componente}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if (resultado != null) {
                if (resultado.length > 0) {
                    for(var x = 0; x < resultado.length; x++){
                        retorno += retornarRegistro(resultado[x]);
                    }
                    retorno += '</tbody>';
                    retorno += '</table>';
                    $("#dvTablaSolicitudes").html(retorno);
                    
                    setTimeout( function(){
                        $("#tbl_Solicitudes").dataTable({
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
                    
                } else {
                    $("#dvTablaSolicitudes").html("No se encontraron resultados");
                }

            } else {
                $("#dvTablaSolicitudes").html("No se encontraron resultados");
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
            $("#dvTablaSolicitudes").html("No se encontraron resultados");
        }
    });
}

function retornarRegistro(resultado){
    var retorno = '';
    if(resultado.co_estado != 'Generada') resultado.nid_solicitud = 0;
    //if(parametro != 0){
        retorno += '<tr>';
        retorno += '<td>' + resultado.codigo + '</td>';
        retorno += '<td>' + resultado.nombre + '</td>';
        retorno += '<td>' + resultado.componente + '</td>';
        retorno += '<td>' + resultado.portafolio + '</td>';
        retorno += '<td>' + resultado.fecha_solicitud +'</td>';
        retorno += '<td>' + resultado.cantidad +'</td>';
        retorno += '<td>' + resultado.recurso +'</td>';
        retorno += '<td>' + resultado.co_estado +'</td>';
        retorno += '<td>'; 
        retorno +=     '<button type="button" onclick="PopUpDetalle(\'' +  resultado.codigo + '\',\'' + resultado.componente +  '\',\'' + resultado.portafolio +  '\',\'' + resultado.cantidad +  '\',\'' + resultado.balanceo +  '\',\'' + resultado.co_estado +  '\');"  style="margin-left:10px;margin-right:10px;"class="btn btn-warning">Ver</button>'; 
        retorno +=     '<button type="button" onclick="PopUpConfirmarSolicitud(' + resultado.nid_solicitud + ',\'' + resultado.codigo +  '\''+',\'' + resultado.co_estado +  '\');" class="btn btn-danger">Anular</button>'; 
        retorno += '</td>';
        retorno += '</tr>';
    //}
    return retorno;
}


function PopUpDetalle(codigo,componente,portafolio,cantidad,balanceo,estado){
    $("#myModal3").modal('show');
    $("#lblNombre2").text(codigo);
    $("#lblPortComponente").text(portafolio + ' - ' + componente);
    $("#lblCantidad").text(cantidad);
    $("#lblBalanceada").text(balanceo);
    $("#lblEstado").text(estado);

}

function PopUpSolicitud(parametro, co_estado){
    Combo_Componente(null,false);
    if(co_estado == "PopUpSolicitudEn Ejecución"){
        fc_MsjError("No es posible Editar porque el solicitud se encuentra En Ejecución");
        return;
    }else     if(co_estado == "Finalizado"){
        fc_MsjError("No es posible Editar porque el solicitud se encuentra Finalizado");
        return;
    }
    var url_ = $("#UrlServicio").val() + '/api/solicitud/PopUpSolicitud';
    var entidad_ = { codigo_solicitud: parametro}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            PopUpSolicitud_Data(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }

    });

}

function PopUpSolicitud_Data(data){
    $("#myModal1").modal('show');

    var url_ = $("#UrlServicio").val() + '/api/Solicitud/CargarFiltroGestion';
    var entidad_ = null;
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            Combo_Recurso_PopUp(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
    //Combo_Recurso_PopUp(data.cbo_recurso);
    //DatosPopUp(data.objeto);
    //Proyectos_solicitud(data.proyectos);
}

function CerrarPopUp_Data(){
    $("#myModal1").modal('hide');
}


function CerrarPopUp_Detalle(){
    $("#myModal3").modal('hide');
}



function DatosPopUp(objeto){
    //nid_solicitud = objeto.nid_solicitud;
    nid_solicitud = 0;
    array_solicitudes_tmp = new Array();
    Combo_Componente(null,false);
    if(nid_solicitud == null || nid_solicitud == 0){
        $("#lblIdPortafolio").html("");
        $("#lblNoPortafolio").html("");
        $("#lblObsPortafolio").html("");
        $("#cbo_RecursoPopUp").val("");
        $("#txtComponente").val("");
        $("#txtDescripcion").val("");
        $("#txtCantidad").val("0");
        
        $("#h4solicitud").html("Generar solicitud");
        
    }else{
        $("#txtNombre").val(objeto.no_nombre);
        $("#dtFechaIniEdit").val(objeto.fe_inicio);
        $("#dtFechaFinEdit").val(objeto.fe_fin);
        $("#cbo_RecursoPopUp").val(objeto.nid_prioridad);
        $("#lblResponsable").html(objeto.no_responsable);
        $("#hfResponsable").val(objeto.nid_responsable);
        $("#txtDescripcion").val(objeto.no_descripcion);
        $("#h4solicitud").html("Modificar solicitud");
    }
}

function Combo_Recurso_PopUp(objeto){
    $("#cbo_RecursoPopUp").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#cbo_RecursoPopUp").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });
}

function Proyectos_solicitud(lista){

    var retorno = '<table id="tbl_Iniciativa" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Descripcion</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].no_codigo  + '</td>';
            retorno += '<td>' + lista[x].no_nombre  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:PopUpConfirmarProyecto(' + lista[x].nid_relacion +  ',\'' + lista[x].no_codigo + '\')" class="btn btn-danger">Desasociar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvProyectos").html("");
    $("#dvProyectos").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_Iniciativa").dataTable({
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

function PortafolioPendiente(){
    $("#h4Portafolio").html("Seleccionar Portafolio");
    PopUpPortafolio();
}

function PopUpPortafolio(){
    $("#txtNombrePortafolio_Buuscar").val("");
    $("#myModal2").modal('show');
    ReloadPortafolios();
}

function ReloadPortafolios(){
    var url_ = $("#UrlServicio").val() + '/api/portafolio/BuscarPortafolios';
    var valor = $("#txtNombrePortafolio_Buscar").val();
    var entidad_ = { nombre : valor}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            RetornarTablaPortafolios(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function RetornarTablaPortafolios(lista){
    
    var retorno = '<table id="tbl_Portafolio" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].codigo  + '</td>';
            retorno += '<td>' + lista[x].nombre  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarPortafolio(\'' + lista[x].nombre +  '\',\'' + lista[x].codigo+ '\',\'' + lista[x].codigo_portafolio+ '\')" class="btn btn-success">Asignar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvPortafolios").html("");
    $("#dvPortafolios").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_Portafolio").dataTable({
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
function CerrarPopUp_Portafolio(){
    $("#myModal2").modal('hide');
}

function AsociarPortafolio(nombre,codigo,idportafolio){

    $("#lblIdPortafolio").html(codigo);
    $("#lblNoPortafolio").html(nombre);
    $("#hfPortafolio").val(idportafolio);
    UpdateComboComponentes();
    //$("#lblObsPortafolio").html(descripcion);

    CerrarPopUp_Portafolio();
}

function UpdateComboComponentes()
{
    var url_ = $("#UrlServicio").val() + '/api/portafolio/ObtenerComponentes';
    var portafolio = $("#hfPortafolio").val();
    var entidad_ = { codigo_portafolio: portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            Combo_Componente(resultado,true);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function Combo_Componente(objeto,reload){
    $("#cbo_ComponentePopUp").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    if(reload){
        $.each(objeto, function (i, element) {
            $("#cbo_ComponentePopUp").append("<option value='" + element.nid_componente + "'>" + element.no_componente + "</option>");
        });
    }
}

function ResponsablePrincipal(){
    $("#h4Responsable").html("Seleccionar Responsable Principal");
    tiporesponsable = 1;
    PopUpResponsable();
}

function PopUpResponsable(){
    $("#txtNombreResponsable_Buuscar").val("");
    $("#myModal2").modal('show');
    ReloadResponsables();
}

function ReloadResponsables(){
    var url_ = $("#UrlServicio").val() + '/api/portafolio/obtenerResponsables';
    var valor = $("#txtNombreResponsable_Buuscar").val();
    var entidad_ = { no_nombre: valor}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            RetornarTablaResponsables(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function AsociarResponsable(nombre,usuario){

    if(tiporesponsable == 1){
        $("#lblResponsable").html(nombre);
        $("#hfResponsable").val(usuario);
    }else{
        $("#lblResponsable2").html(nombre);
        $("#hfResponsable2").val(usuario);
    }

    CerrarPopUp_Responsable();
}

function RetornarTablaResponsables(lista){
    
    var retorno = '<table id="tbl_Responsables" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].no_usrlogin  + '</td>';
            retorno += '<td>' + lista[x].no_nombre  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarResponsable(\'' + lista[x].no_nombre +  '\',' + lista[x].nid_usuario+ ')" class="btn btn-success">Asignar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvResponsables").html("");
    $("#dvResponsables").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_Responsables").dataTable({
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

function CerrarPopUp_Responsable(){
    $("#myModal2").modal('hide');
}

function AgregarProyecto(){
    $("#txtNombrProyecto_Buscar").val("");
    $("#myModal3").modal('show');
    ReloadProyectos();
}

function ReloadProyectos(){
    var url_ = $("#UrlServicio").val() + '/api/solicitud/obtenerProyectosDisponibles';
    var valor = $("#txtNombrProyecto_Buscar").val();
    var entidad_ = { no_nombre: valor, nid_solicitud : nid_solicitud}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            RetornarTablaProyectos_PopUp(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function RetornarTablaProyectos_PopUp(lista){

    var retorno = '<table id="tbl_IniciativasDisponibles" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].no_codigo  + '</td>';
            retorno += '<td>' + lista[x].no_nombre  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarProyecto(\'' + nid_solicitud +  '\',' + lista[x].nid_proyecto+ ')" class="btn btn-success">Asignar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvProyectosDisponibles").html("");
    $("#dvProyectosDisponibles").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_IniciativasDisponibles").dataTable({
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

function CerrarPopUp_Proyecto(){
    $("#myModal3").modal('hide');
}

function AsociarProyecto(solicitud, proyecto){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/solicitud/AsociarProyecto';
    var entidad_ = { nid_proyecto: proyecto, nid_usuario : usr, nid_solicitud : nid_solicitud}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_Proyecto();
            Proyectos_solicitud(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function PopUpConfirmarProyecto(nid_relacion, codigo_proyecto){

    $("#dvConfirmarProyecto").html("¿Está seguro de desasociar el proyecto " + codigo_proyecto + "?");
    $("#myModal4").modal('show');
    nid_relacion_proyecto = nid_relacion;
}

function CerrarPopUp_ConfirmarProyecto(){
    $("#myModal4").modal('hide');
}

function DesAsociarProyecto(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/solicitud/DesAsociarProyecto';
    var entidad_ = { nid_relacion : nid_relacion_proyecto, nid_solicitud : nid_solicitud}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_ConfirmarProyecto();
            Proyectos_solicitud(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}


function PopUpConfirmarSolicitud(solicitud, codigo, co_estado){

    if(solicitud != 0){
        $("#dvConfirmarSolicitud").html("¿Está seguro de anular la solicitud " + codigo + "?");
        $("#myModal7").modal('show');
        nid_solicitud = solicitud;
    }else{
        fc_MsjError('Solo las solicitudes en estado generado, pueden ser anuladas');
    }
}


function CerrarPopUp_ConfirmarSolicitud(){
    $("#myModal7").modal('hide');
}

function AnularSolicitud(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/solicitud/EliminarSolicitud';
    var entidad_ = { nid_usuario : usr, nid_Solicitud : nid_solicitud}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(resultado.respuesta > 0){
                CerrarPopUp_ConfirmarSolicitud();
                buscarSolicitudes();
                fc_MsjSuccess("Transacción Exitosa");
            }else{
                CerrarPopUp_ConfirmarSolicitud();
                fc_MsjError("008 - " + resultado.str_mensaje);
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function getLastIdTmp(){

    var id = 0;
    for(var x = 0;x < array_solicitudes_tmp.length; x++){
        if(id < array_solicitudes_tmp[x].id_tmp){
            id = array_solicitudes_tmp[x].id_tmp; 
        }
    }

    return id + 1;

}
function AgregarSolicitudTmp(){

    var nid_portafolio = $("#hfPortafolio").val();
    var no_portafolio =  $("#lblNoPortafolio").text();
    var recurso = $("#cbo_RecursoPopUp").val();
    var recurso_string = $("#cbo_RecursoPopUp option:selected").text();
    var componente = $("#cbo_ComponentePopUp").val();
    var componente_string = $("#cbo_ComponentePopUp option:selected").text();
    var descripcion = $("#txtDescripcion").val();
    var cantidad = $("#txtCantidad").val();

    if(nid_portafolio.trim() == ""){
        fc_MsjError("Campo Obligatorio : Portafolio");
        return;
    }else if(recurso.trim() == ""){
        fc_MsjError("Campo Obligatorio : Recurso");
        return;
    }else if(componente.trim() == ""){
        fc_MsjError("Campo Obligatorio : Componente");
        return;
    }else if(descripcion.trim() == ""){
        fc_MsjError("Campo Obligatorio : Descripcion");
        return;
    }else if(cantidad.trim() == "" || cantidad.trim() == "0"){
        fc_MsjError("Campo Obligatorio : Cantidad");
        return;
    }

    array_solicitudes_tmp.push({nid_portafolio : nid_portafolio, 
        no_recurso :  recurso_string, 
        no_portafolio : no_portafolio,
        nid_recurso :  recurso, 
        no_componente : componente_string,
        nid_componente :  componente,
        descripcion : descripcion,
        cantidad : cantidad,
        show : true,
        id_tmp : getLastIdTmp()
    });

    Reload_Tabla_Tmp_Solicitudes();
}
function Reload_Tabla_Tmp_Solicitudes(){
    var retorno = '<table id="tbl_Solicitudes_Tmp" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Portafolio</th>';
    retorno += '<th>Componente</th>';
    retorno += '<th>Recurso</th>';
    retorno += '<th>Descripcion</th>';
    retorno += '<th>Cantidad</th>';
    retorno += '<th style="min-width:150px">Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    for(var x = 0; x < array_solicitudes_tmp.length; x++){
        if(array_solicitudes_tmp[x].show){
            retorno += '<tr>'
            retorno += '<td>' + array_solicitudes_tmp[x].no_portafolio + '</td>';
            retorno += '<td>' + array_solicitudes_tmp[x].no_componente + '</td>';
            retorno += '<td>' + array_solicitudes_tmp[x].no_recurso + '</td>';
            retorno += '<td>' + array_solicitudes_tmp[x].descripcion + '</td>';
            retorno += '<td>' + array_solicitudes_tmp[x].cantidad + '</td>';
            retorno +=  '<td>' +  '<button type="button" onclick="Remove_Obj_Tmp_Solicitud(' +  array_solicitudes_tmp[x].id_tmp + ');" class="btn btn-danger">Remover</button>'; 
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    $("#dvTablaSolicitudes_Tmp").html(retorno);


}

function Remove_Obj_Tmp_Solicitud(idtmp){
    for(var x= 0; x < array_solicitudes_tmp.length; x++){
        if(idtmp == array_solicitudes_tmp[x].id_tmp){
            array_solicitudes_tmp[x].show = false;
            Reload_Tabla_Tmp_Solicitudes();
            return;
        }
    }
}
function GrabarDatos(){

    var contar = 0;
    for(var x= 0; x < array_solicitudes_tmp.length; x++){
        if(array_solicitudes_tmp[x].show){
            contar++;
        }
    }

    if(contar== 0){
        fc_MsjError('Debe agregar al menos una solicitud temporal');
        return;
    }
    var url_ = $("#UrlServicio").val() + '/api/solicitud/GenerarSolicitud';
    var entidad_ = { lista : array_solicitudes_tmp };

    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(resultado.respuesta > 0){
                CerrarPopUp_Data();
                buscarSolicitudes();
                fc_MsjSuccess(resultado.str_mensaje);
            }else{
                fc_MsjError(resultado.str_mensaje);
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });

}

