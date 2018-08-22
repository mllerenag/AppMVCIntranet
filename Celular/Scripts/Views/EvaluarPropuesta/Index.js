let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;
var array_memory = new Array();
$(document).ready(function () {
    ActualizarInicio();
    inicializarPagina();
});

function inicializarPagina(){
    $("#h3_NomPortafolio").text("Portafolio: " + $("#nom_portafolio").val());
    CargarFiltros();
    buscarPropuestas();
}


function CargarFiltros(){
    var url_ = $("#UrlServicio").val() + '/api/evaluacionbalanceo/BuscarRecursos';
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
    $("#vl_Recurso").find('option').remove().end().append('<option value="">--Todos--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#vl_Recurso").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });

}



function buscarPropuestas(){
    var retorno = '<table id="tbl_Propuestas" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th># Propuesta</th>';
    retorno += '<th>Código Componente</th>';
    retorno += '<th>Componente</th>';
    retorno += '<th>Recurso</th>';
    retorno += '<th>Cant. S.</th>';
    retorno += '<th>Cant. B.</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Fecha Propuesta</th>';
    retorno += '<th>Marcar</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    

    var recurso = $("#vl_Recurso").val();
    var componente =$("#vl_txtComponente").val();
    var balanceo = $("#vl_txtPropuesta").val();
    var idportafolio = $("#id_portafolio").val();
    var url_ = $("#UrlServicio").val() + '/api/evaluacionbalanceo/BuscarPropuestas';

    var entidad_ = { nid_portafolio: idportafolio, nid_balanceo : balanceo, nid_recurso : recurso, no_componente : componente}
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if (resultado != null) {
                array_memory = resultado;
                if (resultado.length > 0) {
                    $("#dvFooter").css("display","");
                    for(var x = 0; x < resultado.length; x++){
                        retorno += retornarRegistro(resultado[x]);
                    }
                    retorno += '</tbody>';
                    retorno += '</table>';
                    $("#dvTablaPropuestas").html(retorno);
                    
                    setTimeout( function(){
                        $("#tbl_Propuestas").dataTable({
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
                    $("#dvFooter").css("display","none");
                    $("#dvTablaPropuestas").html("No se encontraron resultados");
                }

            } else {
                $("#dvTablaPropuestas").html("No se encontraron resultados");
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
            $("#dvTablaPropuestas").html("No se encontraron resultados");
        }
    });
}




function retornarRegistro(resultado){
    var retorno = "";
    retorno += '<tr>';
    retorno += '<td>' + resultado.nid_balanceo + '</td>';
    retorno += '<td>' + resultado.no_codigo + '</td>';
    retorno += '<td>' + resultado.no_nombre_componente +'</td>';
    retorno += '<td>' + resultado.no_nombre_recurso +'</td>';
    retorno += '<td>' + resultado.nu_solicitado +'</td>';
    retorno += '<td>' + resultado.nu_balanceo +'</td>';
    retorno += '<td>' + resultado.prioridad +'</td>';
    retorno += '<td>' + resultado.fe_crea +'</td>';
    retorno += '<td style="text-align:center">'; 
    retorno += '<input type="checkbox" id="vl_chk_' + resultado.nid_detalle + '" value="' + resultado.nid_detalle + '" />';
    retorno += '</td>';
    retorno += '</tr>';
    return retorno;
}

function Regresar(){
    window.location.href = './SeleccionPortafolio_Evaluacion';
}

function AprobarPropuestas(accion){

    var marcados = Recupera_Datos("dvTablaPropuestas");
    if(marcados.length == 0){
        fc_MsjError("Debe de marcar al menos una propuesta");
        return;
    }
    var tabla = Recupera_Recursos(marcados); 

    AbrirPopUpPropuestas(accion,marcados,tabla);

}

function CerrarPopUp(){
    $("#myModal1").modal('hide');
}

function AbrirPopUpPropuestas(accion,marcados,tabla){
    $("#myModal1").modal('show');
    $("#dvTabla").html(tabla);
    if(accion == 0){
        $("#dvAlerta").addClass("alert-danger").removeClass("alert-success");
        $("#dvAlerta").html("Recursos a descartar");
        $("#dvMotivoRechazo").css('display','');
    }else{
        $("#dvAlerta").removeClass("alert-danger").addClass("alert-success");
        $("#dvAlerta").html("Recursos a aprobar");
        $("#dvMotivoRechazo").css('display','none');
    }
    
}
function Recupera_Recursos(marcados){

    var solicitudes = new Array();
    for(var x = 0; x < marcados.length; x++){
        for(var y = 0; y < array_memory.length; y++){
            if(marcados[x] == array_memory[y].nid_detalle){
                solicitudes.push(array_memory[y]);
            }
        }
    }
    var recursos = new Array();
    var find = false;
    for( var x = 0; x < solicitudes.length; x++){
        find = false;
        for(var y = 0; y < recursos.length; y++){
            if(recursos[y].no_nombre_recurso == solicitudes[x].no_nombre_recurso){
                recursos[y].nu_balanceo += solicitudes[x].nu_balanceo;
                find = true;
            }
        }

        if(!find){
            recursos.push({no_nombre_recurso : solicitudes[x].no_nombre_recurso, nu_balanceo : solicitudes[x].nu_balanceo});
        }
    }

    var retorno = '<table id="tbl_Recursos" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Recurso</th>';
    retorno += '<th>Total</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
   
    for( var x = 0; x < recursos.length; x++)
    {
        retorno += "<tr>";
        retorno += "<td>" + recursos[x].no_nombre_recurso + "</td>";
        retorno += "<td>" + recursos[x].nu_balanceo + "</td>";
        retorno += "</tr>";
    }
    retorno += "</table>";

    return retorno;
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
        //id_items.sort(OrderByTabIndex);
        count = id_items.length;
        for (var i = 0; i < count; i++){
            if(id_items[i].checked)
                parametros.push(id_items[i].value);    
        }
    }

    return parametros;
    
}
function grabarAccion(){
    var accion = $("#dvMotivoRechazo").is(":hidden") ? 1 : 0; 
    var comentario = accion == 0 ? $("#txtMotivoRechazo").val() : "";
    var marcados = Recupera_Datos("dvTablaPropuestas");

    var url_ = $("#UrlServicio").val() + '/api/evaluacionbalanceo/EvaluarPropuesta';
    var entidad_ = { lista_parametros : marcados,  no_comentario : comentario ,  accion : accion , idportafolio : $("#id_portafolio").val() } ;
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            fc_MsjSuccess(resultado.mensaje);
            CerrarPopUp();
            buscarPropuestas();

        },
        error: function (xhr, status, error) {
            fc_MsjSuccess("Se aprobó satisfactoriamente las propuestas marcadas");
            CerrarPopUp();
            buscarPropuestas();
        }
    });
}