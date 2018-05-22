var google = <any>google;
google.charts.load('current', {'packages':['timeline']});
const pintarGrafica = function(informacion) {
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var container = document.getElementById('timeline');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'string', id: 'Process' });
        dataTable.addColumn({ type: 'string', id: 'Estado' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });
        var arrayRows = [];
        for(var key in informacion) { 
            var particularArray = [];
            if(informacion[key].length > 0) {
                informacion[key].forEach((item) => {
                    particularArray.push([
                        key,
                        item.nombre,
                        new Date(0,0,0,0,0,item.inicio),
                        new Date(0,0,0,0,0,item.inicio + item.transcurrido)
                    ]);
                });
            }
            arrayRows = arrayRows.concat(particularArray);
        }
        dataTable.addRows(arrayRows);
        chart.draw(dataTable, {
            timeline: {showBarLabels: false}
        });
    }
};