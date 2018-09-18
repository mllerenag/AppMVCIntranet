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
    //CargarFiltros();
    buscarRecursos();
    buscarComponentes();
    buscarRecursosComponente('C', 0);
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

function buscarRecursos() {
    var retorno = '<table id="tbl_Recursos" style="width:100%" class="table table-bordered table-hover">';
    retorno += '<thead>';
    retorno += '<th># Tipo Recurso</th>';
    retorno += '<th># Cant. Disponible </th>';
    retorno += '<th># Cant. Sol. Adicional </th>';
    retorno += '<th>Acciones</th>';
    retorno += '</thead>';
    retorno += '<tbody>';

    var codigo_portafolio = $("#id_portafolio").val();
    var url_ = $("#UrlServicio").val() + '/api/liberar/BuscarRecursos';

    var entidad_ = { codigo_portafolio: codigo_portafolio }
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
                        retorno += recursos_retornarRegistro(resultado[x]);
                    }
                    retorno += '</tbody>';
                    retorno += '</table>';
                    $("#dvTablaRecursos").html(retorno);

                    setTimeout(function () {
                        $("#tbl_Recursos").dataTable({
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
                    $("#dvTablaRecursos").html("No se encontraron resultados");
                }

            } else {
                $("#dvTablaRecursos").html("No se encontraron resultados");
            }
        },
        error: function (xhr, status, error) {
            fc_MsjError('001 - Ocurrio un error');
            $("#dvTablaRecursos").html("No se encontraron resultados");
        }
    });
}

    function recursos_retornarRegistro(resultado){
        var retorno = '';
        var tipo_filtro = 'R';

        retorno += '<tr>';
        retorno += '<td>' + resultado.nombre + '</td>';
        retorno += '<td>' + resultado.total +'</td>';
        retorno += '<td>' + resultado.adicional +'</td>';

        retorno += '<td>' + '<button type="button" onclick="PopUpConfirmarRecursosComponente(' +  resultado.codigo_recurso + ',\'' + tipo_filtro + '\');" class="btn btn-primary">Recursos Candidatos</button></td>';
        retorno += '</tr>';
        return retorno;
    }

    function PopUpConfirmarRecursosComponente(codigo, tipo_filtro){
        buscarRecursosComponente(tipo_filtro,codigo);
    }

    function buscarComponentes() {
        var retorno = '<table id="tbl_Componentes" style="width:100%" class="table table-bordered table-hover">';
        retorno += '<thead>';
        retorno += '<th># Código</th>';
        retorno += '<th># Tipo Componente</th>';
        retorno += '<th># Componente</th>';
        retorno += '<th># Prioridad </th>';
        retorno += '<th>Acciones</th>';
        retorno += '</thead>';
        retorno += '<tbody>';

        var codigo_portafolio = $("#id_portafolio").val();
        var url_ = $("#UrlServicio").val() + '/api/liberar/BuscarComponentesCerrados';

        var entidad_ = { codigo_portafolio: codigo_portafolio }
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
                            retorno += componentes_retornarRegistro(resultado[x]);
                        }
                        retorno += '</tbody>';
                        retorno += '</table>';
                        $("#dvTablaComponentes").html(retorno);

                        setTimeout(function () {
                            $("#tbl_Componentes").dataTable({
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
                        $("#dvTablaComponentes").html("No se encontraron resultados");
                    }

                } else {
                    $("#dvTablaComponentes").html("No se encontraron resultados");
                }
            },
            error: function (xhr, status, error) {
                fc_MsjError('001 - Ocurrio un error');
                $("#dvTablaComponentes").html("No se encontraron resultados");
            }
        });
    }

        function componentes_retornarRegistro(resultado){
            var retorno = '';
            var tipo_filtro = 'C';

            retorno += '<tr>';
            retorno += '<td>' + resultado.codigo + '</td>';
            retorno += '<td>' + resultado.tipo_componente + '</td>';
            retorno += '<td>' + resultado.nombre +'</td>';
            retorno += '<td>' + resultado.prioridad +'</td>';

            retorno += '<td>' + '<button type="button" onclick="PopUpConfirmarRecursosComponente(' +  resultado.codigo_componente + ',\'' + tipo_filtro + '\');" class="btn btn-primary">Mostrar Recursos</button></td>';
            retorno += '</tr>';
            return retorno;
        }

        function buscarRecursosComponente(tipo_filtro, codigo_filtro) {
            var retorno = '<table id="tbl_RecursosComponente" style="width:100%" class="table table-bordered table-hover">';
            retorno += '<thead>';
            retorno += '<th># Código </th>';
            retorno += '<th># Componente </th>';
            retorno += '<th># Prioridad </th>';
            retorno += '<th># Tipo Recruso </th>';
            retorno += '<th># Cant. Asignados </th>';
            retorno += '<th>Acciones</th>';
            retorno += '</thead>';
            retorno += '<tbody>';

            var codigo_portafolio = $("#id_portafolio").val();
            var url_ = $("#UrlServicio").val() + '/api/liberar/BuscarRecursosComponente';

            var entidad_ = { codigo_portafolio: codigo_portafolio, tipo_filtro:tipo_filtro, codigo_filtro:codigo_filtro}
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
                                retorno += recursoscomponente_retornarRegistro(resultado[x]);
                            }
                            retorno += '</tbody>';
                            retorno += '</table>';
                            $("#dvTablaRecursosComponente").html(retorno);

                            setTimeout(function () {
                                $("#tbl_RecursosComponente").dataTable({
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
                            $("#dvTablaRecursosComponente").html("No se encontraron resultados");
                        }

                    } else {
                        $("#dvTablaRecursosComponente").html("No se encontraron resultados");
                    }
                },
                error: function (xhr, status, error) {
                    fc_MsjError('001 - Ocurrio un error');
                    $("#dvTablaRecursosComponente").html("No se encontraron resultados");
                }
            });
        }

        function recursoscomponente_retornarRegistro(resultado){
            var retorno = '';
            retorno += '<tr>';
            retorno += '<td>' + resultado.codigo_componente + '</td>';
            retorno += '<td>' + resultado.componente +'</td>';
            retorno += '<td>' + resultado.prioridad +'</td>';
            retorno += '<td>' + resultado.recurso +'</td>';
            retorno += '<td>' + resultado.total_recurso +'</td>';

            retorno += '<td>' + '<button type="button" onclick="LiberarRecursoComponente(' +  resultado.codigo_componente + ',' +  resultado.codigo_recurso + ',\'' + resultado.recurso + '\');" class="btn btn-primary">Liberar</button></td>';
            retorno += '</tr>';
            return retorno;
        }

        function LiberarRecursoComponente(nid_componente, nid_recurso){
            
            var nid_portafolio = $("#id_portafolio").val();
            var url_ = $("#UrlServicio").val() + '/api/liberar/LiberarRecursoComponente';
            var entidad_ = {nid_portafolio : nid_portafolio, nid_componente : nid_componente, nid_recurso : nid_recurso}
            $.ajax({
                url: url_,
                data: entidad_,
                dataType: 'json',
                type: "post",
                success: function (resultado) {
                    if(resultado.respuesta > 0){
                        //CerrarPopUp_ConfirmarLiberar();
                        buscarRecursos();
                        buscarComponentes();
                        buscarRecursosComponente('C', 0);

                        fc_MsjSuccess("Se libero el recurso correctamente.");
                    }else{
                        //CerrarPopUp_ConfirmarLiberar();
                        fc_MsjError("008 - " + resultado.str_mensaje);
                    }
                },
                error: function (xhr, status, error) {
                    fc_MsjError('001 - Ocurrio un error');
                }
            });
        }