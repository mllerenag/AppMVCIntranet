let $ = require('jquery');
let confirm = require('jquery-confirm');
var tblAsignacion = null;
var tblAccesorioDev = null;
$(document).ready(function () {
    ActualizarInicio();
    buscarPortafolios();
});

function buscarPortafolios(){
    var retorno = '<table id="tbl_Portafolios" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th>Código</th>';
    retorno += '<th>Nombre</th>';
    retorno += '<th># Fecha Creación</th>';
    retorno += '<th>Categoría</th>';
    retorno += '<th>Prioridad</th>';
    retorno += '<th>Responsable</th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';
    
    var codigo = $("#txtCodigo").val();
    var nombre = $("#txtNombre").val();
    var url_ = $("#UrlServicio").val() + '/api/liberar/BuscarPortafolios';
    var entidad_ = { codigo: codigo, nombre: nombre}
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
    retorno += '<tr>';
    retorno += '<td>' + resultado.codigo + '</td>';
    retorno += '<td>' + resultado.nombre + '</td>';
    retorno += '<td>' + resultado.fecha_creacion +'</td>';
    retorno += '<td>' + resultado.categoria +'</td>';
    retorno += '<td>' + resultado.prioridad +'</td>';
    retorno += '<td>' + resultado.responsable +'</td>';

    retorno += '<td>' + '<button type="button" onclick="redirectToEvaluacion(' +  resultado.codigo_portafolio + ',\'' + resultado.nombre + '\',\'' + resultado.codigo + '\',\'' + resultado.descripcion + '\');" class="btn btn-primary">Revisar</button></td>';
    retorno += '</tr>';
    return retorno;
}

function redirectToEvaluacion(parametro,nombre,codigo,descripcion){
    var entidad_ = { prm : parametro}
    var link = $("#UrlServicioSeleccion").val();
    window.location.href = link + '?prm=' + parametro + "&nom=" + nombre + "&cod=" + codigo + "&des=" + descripcion;
}