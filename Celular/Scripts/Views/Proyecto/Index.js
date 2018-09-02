let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;

var nid_proyecto = 0;
var nid_relacion_proyecto = 0;

$(document).ready(function () {
    var nombre = $("#nom_usuario").val();
    ActualizarInicio();
    $('.dtpicker').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    })

    buscarProyectos();
    
});


function buscarProyectos(){
    var retorno = '<table id="tbl_Portafolios" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th>Descripcion</th>';
    retorno += '<th>Fecha Creación</th>';
    retorno += '<th>Fecha Inicio</th>';
    retorno += '<th>Fecha Fin</th>';
    retorno += '<th>Responsable</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Estado</th>';
    retorno += '<th style="min-width:150px">Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';


    var codigo = $("#vl_txtCodigo").val();
    var fechaini =$("#dtFechaIni").val();
    var fechafin = $("#dtFechaFin").val();

    if (fechaini != "" && fechafin != ""){
        if(Date.parse(fechafin) < Date.parse(fechaini)){
            fc_MsjError("La Fecha Inicio Proyecto no puede ser mayor a la Fecha Fin Proyecto");
            return;
        }
    }
    var url_ = $("#UrlServicio").val() + '/api/proyecto/BuscarProyectos';
    var entidad_ = { codigo: codigo, fecha_creacion_ini : fechaini, fecha_creacion_fin : fechafin}
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
                    $("#dvTablaProyectos").html(retorno);
                    
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
                    
                } else {
                    $("#dvTablaProyectos").html("No se encontraron resultados");
                }

            } else {
                $("#dvTablaProyectos").html("No se encontraron resultados");
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
            $("#dvTablaProyectos").html("No se encontraron resultados");
        }
    });
}

function retornarRegistro(resultado){
    var retorno = '';
    var parametro = 0;
    if(resultado.co_estado != "003" && resultado.co_estado != "004")
        parametro = resultado.codigo_proyecto;
    if(parametro != 0){
        retorno += '<tr>';
        retorno += '<td>' + resultado.codigo + '</td>';
        retorno += '<td>' + resultado.nombre + '</td>';
        retorno += '<td>' + resultado.descripcion + '</td>';
        retorno += '<td>' + resultado.fecha_creacion +'</td>';
        retorno += '<td>' + resultado.fecha_inicio +'</td>';
        retorno += '<td>' + resultado.fecha_fin +'</td>';
        retorno += '<td>' + resultado.responsable + '</td>';
        retorno += '<td>' + resultado.prioridad +'</td>';
        retorno += '<td>' + resultado.co_estado +'</td>';
        retorno += '<td>'; 
        retorno +=     '<button type="button" onclick="PopUpProyecto(' +  parametro + ',\'' + resultado.co_estado +  '\');"  style="margin-left:10px;margin-right:10px;"class="btn btn-warning">Editar</button>'; 
        retorno +=     '<button type="button" onclick="PopUpConfirmarProyecto(' +  parametro + ',\'' + resultado.codigo +  '\''+',\'' + resultado.co_estado +  '\');" class="btn btn-danger">Anular</button>'; 
        retorno += '</td>';
        retorno += '</tr>';
    }
    return retorno;
}

function PopUpProyecto(parametro, co_estado){

    if(co_estado == "En Ejecución"){
        fc_MsjError("No es posible Editar porque el proyecto se encuentra En Ejecución");
        return;
    }else     if(co_estado == "Finalizado"){
        fc_MsjError("No es posible Editar porque el proyecto se encuentra Finalizado");
        return;
    }
    var url_ = $("#UrlServicio").val() + '/api/proyecto/PopUpProyecto';
    var entidad_ = { codigo_proyecto: parametro}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            PopUpProyecto_Data(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }

    });

}

function PopUpProyecto_Data(data){
    $("#myModal1").modal('show');
    Combo_Prioridad_PopUp(data.cbo_prioridad);
    DatosPopUp(data.objeto);

}

function CerrarPopUp_Data(){
    $("#myModal1").modal('hide');
}

function DatosPopUp(objeto){
    nid_proyecto = objeto.nid_proyecto;
    if(nid_proyecto == null || nid_proyecto == 0){
        $("#txtNombre").val("");
        $("#dtFechaIniEdit").val("");
        $("#dtFechaFinEdit").val("");
        $("#cbo_PrioridadPopUp").val("");
        $("#lblResponsable").html("");
        $("#hfResponsable").val("0");
        $("#txtDescripcion").val("");
        $("#h4Proyecto").html("Nuevo Proyecto");
        document.getElementById("btnAgregarProyectos").disabled = true;
        
    }else{
        $("#txtNombre").val(objeto.no_nombre);
        $("#dtFechaIniEdit").val(objeto.fe_inicio);
        $("#dtFechaFinEdit").val(objeto.fe_fin);
        $("#cbo_PrioridadPopUp").val(objeto.nid_prioridad);
        $("#lblResponsable").html(objeto.no_responsable);
        $("#hfResponsable").val(objeto.nid_responsable);
        $("#txtDescripcion").val(objeto.no_descripcion);
        $("#h4Proyecto").html("Modificar Proyecto");
        document.getElementById("btnAgregarProyectos").disabled = false;
    }
}

function Combo_Prioridad_PopUp(objeto){
    $("#cbo_PrioridadPopUp").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#cbo_PrioridadPopUp").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });


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
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarProyecto(\'' + nid_proyecto +  '\',' + lista[x].nid_proyecto+ ')" class="btn btn-success">Asignar</button></td>';
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

function CerrarPopUp_ConfirmarProyecto(){
    $("#myModal4").modal('hide');
}


function PopUpConfirmarProyecto(proyecto, codigo,co_estado){

    if(co_estado == "En Ejecución"){
        fc_MsjError("No es posible Anular porque el proyecto se encuentra En Ejecución");
        return;
    }else     if(co_estado == "Finalizado"){
        fc_MsjError("No es posible Anular porque el proyecto se encuentra Finalizado");
        return;
    }

    $("#dvConfirmarProyecto").html("¿Está seguro de anular el Proyecto " + codigo + "?");
    $("#myModal7").modal('show');
    nid_proyecto = proyecto;
}


function CerrarPopUp_ConfirmarProyecto(){
    $("#myModal7").modal('hide');
}

function AnularProyecto(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/proyecto/EliminarProyecto';
    var entidad_ = { nid_usuario : usr, nid_proyecto : nid_proyecto}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(resultado.respuesta > 0){
                CerrarPopUp_ConfirmarProyecto();
                buscarProyectos();
            }else{
                CerrarPopUp_ConfirmarProyecto();
                fc_MsjError("008 - " + resultado.str_mensaje);
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function GrabarDatos(){
    var nombre = $("#txtNombre").val();
    var prioridad = $("#cbo_PrioridadPopUp").val();
    var responsable1 = $("#hfResponsable").val();
    var descripcion = $("#txtDescripcion").val();
    var fe_inicio = $("#dtFechaIniEdit").val();
    var fe_fin = $("#dtFechaFinEdit").val();
    var usr = $("#id_usuario").val();


    if (fe_inicio != "" && fe_fin != ""){
        if(Date.parse(fe_fin) < Date.parse(fe_inicio)){
            fc_MsjError("La Fecha Inicio Proyecto no puede ser mayor a la Fecha Fin Proyecto");
            return;
        }
    }

    if(nombre.trim() == ""){
        fc_MsjError("Campo Obligatorio : Nombre");
        return;
    }else if(prioridad.trim() == ""){
        fc_MsjError("Campo Obligatorio : Prioridad");
        return;
    }else if(responsable1.trim() == "" || responsable1.trim() == "0"){
        fc_MsjError("Campo Obligatorio : Responsable");
        return;
    }else if(fe_inicio.trim() == ""){
        fc_MsjError("Campo Obligatorio : Fecha Inicio");
        return;
    }else if(fe_fin.trim() == ""){
        fc_MsjError("Campo Obligatorio : Fecha Fin");
        return;
     }
    var url_ = $("#UrlServicio").val() + '/api/proyecto/ActualizarProyecto';
    var entidad_ = { nid_proyecto : nid_proyecto, no_nombre : nombre, 
        nid_prioridad : prioridad, nid_responsable :  responsable1,
        tx_descripcion : descripcion, fecha_inicio :  fe_inicio, fecha_fin : fe_fin};

    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(nid_proyecto > 0){
                CerrarPopUp_Data();
                buscarProyectos();
                fc_MsjSuccess("Transacción Exitosa");
            }else{
                CerrarPopUp_Data();
                nid_proyecto = resultado.nid_proyecto;
                fc_MsjSuccess("Proyecto Generado, Código " + resultado.no_codigo);
                buscarProyectos();
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });


}

