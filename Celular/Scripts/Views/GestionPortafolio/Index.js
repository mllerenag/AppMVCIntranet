let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;

var nid_portafolio = 0;
var tiporesponsable = 0;
var nid_relacion_iniciativa = 0;
var nid_relacion_componente = 0;
$(document).ready(function () {
    var nombre = $("#nom_usuario").val();
    ActualizarInicio();
    $('.dtpicker').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    })
    cargarFiltros();
    buscarPortafolios();
    
});

function cargarFiltros(){

    
    var url_ = $("#UrlServicio").val() + '/api/portafolio/CargarFiltroGestion';
    var entidad_ = null;
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            Combo_Categoria(resultado);
        },
        error: function (xhr, status, error) {
                fc_MsjError('001 - Ocurrio un error');
            }
    });
}
function Combo_Categoria(objeto){
    $("#vl_Categoria").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#vl_Categoria").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });

}

function buscarPortafolios(){
    var retorno = '<table id="tbl_Portafolios" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th>Fecha Creación</th>';
    retorno += '<th>Categoria</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Responsable</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    

    var codigo = $("#vl_txtCodigo").val();
    var categoria =$("#vl_txtCodigo").val();
    var nombre = $("#vl_Categoria").val();
    var fechaini =$("#dtFechaIni").val();
    var fechafin = $("#dtFechaFin").val();
    
    var url_ = $("#UrlServicio").val() + '/api/portafolio/BuscarPortafolios';
    var entidad_ = { codigo: codigo, categoria : categoria, fecha_creacion_ini : fechaini, fecha_creacion_fin : fechafin}
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
                    $("#dvTablaPortafolios").html(retorno);
                    
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
                    $("#dvTablaPortafolios").html("No se encontraron resultados");
                }

            } else {
                $("#dvTablaPortafolios").html("No se encontraron resultados");
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
            $("#dvTablaPortafolios").html("No se encontraron resultados");
        }
    });
}

function retornarRegistro(resultado){
    var retorno = '';
    var parametro = 0;
    if(resultado.co_estado != "003" && resultado.co_estado != "004")
        parametro = resultado.codigo_portafolio;
    if(parametro != 0){
        retorno += '<tr>';
        retorno += '<td>' + resultado.codigo + '</td>';
        retorno += '<td>' + resultado.nombre + '</td>';
        retorno += '<td>' + resultado.fecha_creacion +'</td>';
        retorno += '<td>' + resultado.categoria +'</td>';
        retorno += '<td>' + resultado.prioridad +'</td>';
        retorno += '<td>' + resultado.responsable +'</td>';
        retorno += '<td>'; 
        retorno +=     '<button type="button" onclick="PopUpPortafolio(' +  parametro + ');"  style="margin-left:10px;margin-right:10px;"class="btn btn-warning">Editar</button>'; 
        retorno +=     '<button type="button" onclick="PopUpConfirmarPortafolio(' +  parametro + ',\'' + resultado.codigo +  '\');" class="btn btn-danger">Anular</button>'; 
        retorno += '</td>';
        retorno += '</tr>';
    }
    return retorno;
}

function PopUpPortafolio(parametro){

    var url_ = $("#UrlServicio").val() + '/api/portafolio/PopUpPortafolio';
    var entidad_ = { codigo_portafolio: parametro}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            PopUpPortafolio_Data(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }

    });

}

function PopUpPortafolio_Data(data){
    $("#myModal1").modal('show');
    Combo_Prioridad_PopUp(data.cbo_prioridad);
    Combo_Categoria_PopUp(data.cbo_categoria);
    DatosPopUp(data.objeto);
    Iniciativas_Portafolio(data.iniciativas);
    Componentes_Portafolio(data.componentes);

}

function CerrarPopUp_Data(){
    $("#myModal1").modal('hide');
}

function DatosPopUp(objeto){
    nid_portafolio = objeto.nid_portafolio;
    if(nid_portafolio == null || nid_portafolio == 0){
        $("#txtNombre").val("");
        $("#cbo_CategoriaPopUp").val("");
        $("#cbo_PrioridadPopUp").val("");
        $("#lblResponsable").html("");
        $("#lblResponsable2").html("");
        $("#hfResponsable").val("0");
        $("#hfResponsable2").val("0");
        $("#txtDescripcion").val("");
        $("#h4Portafolio").html("Nuevo Portafolio");
        document.getElementById("btnAgregarIniciativas").disabled = true;
        document.getElementById("btnAgregarComponentes").disabled = true;
        
    }else{
        $("#txtNombre").val(objeto.no_nombre);
        $("#cbo_CategoriaPopUp").val(objeto.nid_categoria);
        $("#cbo_PrioridadPopUp").val(objeto.nid_prioridad);
        $("#lblResponsable").html(objeto.no_responsable);
        $("#lblResponsable2").html(objeto.no_responsable2);
        $("#hfResponsable").val(objeto.nid_responsable);
        $("#hfResponsable2").val(objeto.nid_responsable2);
        $("#txtDescripcion").val(objeto.tx_descripcion);
        $("#h4Portafolio").html("Modificar Portafolio");
        document.getElementById("btnAgregarIniciativas").disabled = false;
        document.getElementById("btnAgregarComponentes").disabled = false;
    }
}

function Combo_Prioridad_PopUp(objeto){
    $("#cbo_PrioridadPopUp").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#cbo_PrioridadPopUp").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });


}

function Combo_Categoria_PopUp(objeto){
    $("#cbo_CategoriaPopUp").find('option').remove().end().append('<option value="">--Seleccione--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#cbo_CategoriaPopUp").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });

}

function Iniciativas_Portafolio(lista){

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
            retorno += '<td>' + '<button type="button" onclick="javascript:PopUpConfirmarIniciativa(' + lista[x].nid_relacion +  ',\'' + lista[x].no_codigo + '\')" class="btn btn-danger">Desasociar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvIniciativas").html("");
    $("#dvIniciativas").html(retorno);
                    
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

function Componentes_Portafolio(lista){

    var retorno = '<table id="tbl_Componentes" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Descripcion</th>';
    retorno += '<th>Tipo</th>';
    retorno += '<th>Fecha Inicio</th>';
    retorno += '<th>Fecha Fin</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Responsable</th>';
    retorno += '<th>Estado</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].no_codigo  + '</td>';
            retorno += '<td>' + lista[x].no_componente  + '</td>';
            retorno += '<td>' + lista[x].no_tipo  + '</td>';
            retorno += '<td>' + lista[x].no_fecha_inicio  + '</td>';
            retorno += '<td>' + lista[x].no_fecha_fin  + '</td>';
            retorno += '<td>' + lista[x].no_prioridad  + '</td>';
            retorno += '<td>' + lista[x].no_responsable  + '</td>';
            retorno += '<td>' + lista[x].co_estado  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:PopUpConfirmarComponente(' + lista[x].nid_componente +  ',\'' + lista[x].no_codigo +'\')" class="btn btn-danger">Desasociar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvComponentes").html("");
    $("#dvComponentes").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_Componentes").dataTable({
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

function ResponsablePrincipal(){
    $("#h4Responsable").html("Seleccionar Responsable Principal");
    tiporesponsable = 1;
    PopUpResponsable();
}

function ResponsableSuplente(){
    $("#h4Responsable").html("Seleccionar Responsable Suplente");
    tiporesponsable = 2;
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

function AgregarIniciativa(){
    $("#txtNombreIniciativa_Buuscar").val("");
    $("#myModal3").modal('show');
    ReloadIniciativas();
}



function ReloadIniciativas(){
    var url_ = $("#UrlServicio").val() + '/api/portafolio/obtenerIniciativasDisponibles';
    var valor = $("#txtNombreIniciativa_Buuscar").val();
    var entidad_ = { no_nombre: valor, nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            RetornarTablaIniciativas_PopUp(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function RetornarTablaIniciativas_PopUp(lista){

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
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarIniciativa(\'' + nid_portafolio +  '\',' + lista[x].nid_iniciativa+ ')" class="btn btn-success">Asignar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvIniciativasDisponibles").html("");
    $("#dvIniciativasDisponibles").html(retorno);
                    
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

function CerrarPopUp_Iniciativa(){
    $("#myModal3").modal('hide');
}

function AsociarIniciativa(portafolio, iniciativa){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/portafolio/AsociarIniciativa';
    var entidad_ = { nid_iniciativa: iniciativa, nid_usuario : usr, nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_Iniciativa();
            Iniciativas_Portafolio(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function PopUpConfirmarIniciativa(nid_relacion, codigo_iniciativa){

    $("#dvConfirmarIniciativa").html("¿Está seguro de desasociar la iniciativa " + codigo_iniciativa + "?");
    $("#myModal4").modal('show');
    nid_relacion_iniciativa = nid_relacion;
}

function CerrarPopUp_ConfirmarIniciativa(){
    $("#myModal4").modal('hide');
}

function DesasociarIniciativa(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/portafolio/DesasociarIniciativa';
    var entidad_ = { nid_relacion : nid_relacion_iniciativa, nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_ConfirmarIniciativa();
            Iniciativas_Portafolio(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}


function AgregarComponente(){
    $("#txtNombreComponente_Buuscar").val("");
    $("#cboTipoComponente").val("PRY");
    $("#myModal5").modal('show');
    ReloadComponentes();
}

function ReloadComponentes(){
    var url_ = $("#UrlServicio").val() + '/api/portafolio/obtenerComponentesDisponibles';
    var valor = $("#txtNombreComponente_Buuscar").val();
    var tipo = $("#cboTipoComponente").val();

    var entidad_ = { co_tipo :  tipo,  nid_portafolio : nid_portafolio, no_nombre : valor}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            RetornarTablaComponentes_PopUp(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function RetornarTablaComponentes_PopUp(lista){

    var retorno = '<table id="tbl_ComponentesPopUp" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Descripcion</th>';
    retorno += '<th>Tipo</th>';
    retorno += '<th>Fecha Inicio</th>';
    retorno += '<th>Fecha Fin</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Responsable</th>';
    retorno += '<th>Estado</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    if(lista != null){
        for(var x= 0; x < lista.length; x++){
            retorno += '<tr>';
            retorno += '<td>' + lista[x].no_codigo  + '</td>';
            retorno += '<td>' + lista[x].no_componente  + '</td>';
            retorno += '<td>' + lista[x].no_tipo  + '</td>';
            retorno += '<td>' + lista[x].no_fecha_inicio  + '</td>';
            retorno += '<td>' + lista[x].no_fecha_fin  + '</td>';
            retorno += '<td>' + lista[x].no_prioridad  + '</td>';
            retorno += '<td>' + lista[x].no_responsable  + '</td>';
            retorno += '<td>' + lista[x].co_estado  + '</td>';
            retorno += '<td>' + '<button type="button" onclick="javascript:AsociarComponente(' + lista[x].nid_codigo + ',\''  + lista[x].no_tipo + '\')" class="btn btn-success">Asociar</button></td>';
            retorno += '</tr>';
        }
    }
    retorno += '</tbody>';
    retorno += '</table>';
    $("#dvComponentesDisponibles").html("");
    $("#dvComponentesDisponibles").html(retorno);
                    
    setTimeout( function(){
        $("#tbl_ComponentesPopUp").dataTable({
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

function CerrarPopUp_Componente(){
    $("#myModal5").modal('hide');
}

function AsociarComponente(codigo,tipo){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/portafolio/AsociarComponente';
    var entidad_ = { nid_proyecto: (tipo == "Proyecto" ? codigo : null), nid_programa : (tipo == "Programa" ? codigo : null), nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_Componente();
            Componentes_Portafolio(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

function PopUpConfirmarComponente(nid_relacion, codigo_componente){

    $("#dvConfirmarComponente").html("¿Está seguro de desasociar el componente " + codigo_componente + "?");
    $("#myModal6").modal('show');
    nid_relacion_componente = nid_relacion;
}

function CerrarPopUp_ConfirmarComponente(){
    $("#myModal6").modal('hide');
}

function DesasociarComponente(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/portafolio/DesasociarComponente';
    var entidad_ = { nid_componente : nid_relacion_componente, nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            CerrarPopUp_ConfirmarComponente();
            Componentes_Portafolio(resultado);
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}


function PopUpConfirmarPortafolio(portafolio, codigo){

    $("#dvConfirmarPortafolio").html("¿Está seguro de anular el Portafolio " + codigo + "?");
    $("#myModal7").modal('show');
    nid_portafolio = portafolio;
}


function CerrarPopUp_ConfirmarPortafolio(){
    $("#myModal7").modal('hide');
}

function AnularPortafolio(){
    var usr = $("#id_usuario").val();
    var url_ = $("#UrlServicio").val() + '/api/portafolio/EliminarPortafolio';
    var entidad_ = { nid_usuario : usr, nid_portafolio : nid_portafolio}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(resultado.respuesta > 0){
                CerrarPopUp_ConfirmarPortafolio();
                buscarPortafolios();
            }else{
                CerrarPopUp_ConfirmarPortafolio();
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
    var categoria = $("#cbo_CategoriaPopUp").val();
    var prioridad = $("#cbo_PrioridadPopUp").val();
    var responsable1 = $("#hfResponsable").val();
    var responsable2 = $("#hfResponsable2").val();
    var descripcion = $("#txtDescripcion").val();
    var usr = $("#id_usuario").val();

    if(nombre.trim() == ""){
        fc_MsjError("Campo Obligatorio : Nombre");
        return;
    }else if(categoria.trim() == ""){
        fc_MsjError("Campo Obligatorio : Categoria");
        return;
    }else if(prioridad.trim() == ""){
        fc_MsjError("Campo Obligatorio : Prioridad");
        return;
    }else if(responsable1.trim() == ""){
        fc_MsjError("Campo Obligatorio : Responsable");
        return;
    }
    var url_ = $("#UrlServicio").val() + '/api/portafolio/ActualizarPortafolio';
    var entidad_ = { no_nombre : nombre, nid_portafolio : nid_portafolio, nid_categoria : categoria,
        nid_prioridad : prioridad, nid_responsable :  responsable1, nid_responsable2 : responsable2,
        tx_descripcion : descripcion , nid_usuario : usr };

    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if(nid_portafolio > 0){
                CerrarPopUp_Data();
                buscarPortafolios();
                fc_MsjSuccess("Transacción Exitosa");
            }else{
                document.getElementById("btnAgregarIniciativas").disabled = false;
                document.getElementById("btnAgregarComponentes").disabled = false;
                nid_portafolio = resultado.nid_portafolio;
                fc_MsjSuccess("Portafolio Generado, Código " + resultado.no_codigo);
                buscarPortafolios();
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
        }
    });
}

/*

*/