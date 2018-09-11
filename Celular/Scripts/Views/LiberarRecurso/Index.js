let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;
var array_memory = new Array();
$(document).ready(function () {
    ActualizarInicio();
    inicializarPagina();
});

function inicializarPagina() {
    $("#h3_NomPortafolio").text("Portafolio: " + $("#nom_portafolio").val());
    CargarFiltros();
    buscarPropuestas();
}


function CargarFiltros() {
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
function Combo_Recurso(objeto) {
    $("#vl_Recurso").find('option').remove().end().append('<option value="">--Todos--</option>').val('');

    $.each(objeto, function (i, element) {
        $("#vl_Recurso").append("<option value='" + element.codigo + "'>" + element.nombre + "</option>");
    });

}



function buscarPropuestas() {
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
    var componente = $("#vl_txtComponente").val();
    var balanceo = $("#vl_txtPropuesta").val();
    var idportafolio = $("#id_portafolio").val();
    var url_ = $("#UrlServicio").val() + '/api/evaluacionbalanceo/BuscarPropuestas';

    var entidad_ = { nid_portafolio: idportafolio, nid_balanceo: balanceo, nid_recurso: recurso, no_componente: componente }
    $.ajax({
        url: url_,
        data: entidad_,
        dataType: 'json',
        type: "post",
        success: function (resultado) {
            if (resultado != null) {
                array_memory = resultado;
                if (resultado.length > 0) {
                    $("#dvFooter").css("display", "");
                    for (var x = 0; x < resultado.length; x++) {
                        retorno += retornarRegistro(resultado[x]);
                    }
                    retorno += '</tbody>';
                    retorno += '</table>';
                    $("#dvTablaPropuestas").html(retorno);

                    setTimeout(function () {
                        $("#tbl_Propuestas").dataTable({
                            'paging': true,
                            'lengthChange': true,
                            'searching': true,
                            'ordering': true,
                            'info': true,
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
                    }, 500);

                } else {
                    $("#dvFooter").css("display", "none");
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

