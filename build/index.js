var informacionGrafica = {};
var procesoAnterior = "";
var main = function () {
    informacionGrafica = {};
    procesoAnterior = "";
  //document.getElementById("SeccionCritica").innerHTML = "";
  //   document.getElementById("proceso-0").innerHTML = "";
  //   document.getElementById("proceso-1").innerHTML = "";
  //   document.getElementById("proceso-2").innerHTML = "";
  //   document.getElementById("bloqueado").innerHTML = "";
  //   document.getElementById("listos").innerHTML = "";
  // //  document.getElementById("tablaProcesos").innerHTML = "";
    var semaforo = new Semaforo();
    var len = semaforo.planificadores.length;
    var total = 10;
    var tiempo = 0;
    var time = setInterval(function () {
        semaforo.transcurrirTiempo();
        if (total > 0) {
            var nodo = new Nodo();
            nodo.cola = (Math.round(Math.random() * 100) % len);
            nodo.llegada = tiempo;
            nodo.nombre = Math.round(Math.random() * 100) + "" + tiempo + "" + Math.round(Math.random() * 100);
            nodo.prioridad = 1;
            nodo.rafaga = Math.round(Math.random() * 8) + 1;
            nodo.transcurrido = 0;
            nodo.siguiente = null;
            semaforo.agregarNodo(nodo);
            total--;
        }
        semaforo.validarEnvejecimiento();
        informacionDivs(semaforo, tiempo);
        informacionTimeLine(semaforo, tiempo);
        informacionTabla();
        tiempo++;
        if (semaforo.procesoActual === null && semaforo.bloqueado === semaforo.bloqueado.siguiente) {
            clearInterval(time);
        }
    }, 1000);
};
var informacionDivs = function (semaforo, tiempo) {
    var len = semaforo.planificadores.length;
    var texto = "";
    var pre;
    var pos;
    if (semaforo.procesoActual === null) {
        texto = "sin proceso actual";
    }
    else {
      numCola = semaforo.procesoActual.cola;
      nomCola = "";
      switch (numCola) {
        case numCola = 0:
          nomCola = "Fifo";
          break;
        case numCola = 1:
          nomCola = "R.Robbin";
          break;
        case numCola = 2:
          nomCola = "SJF";
          break;
        default:
          nomCola = "SJF";
          break;
      }
      texto = "Proceso: "+semaforo.procesoActual.nombre + " T.Rafaga: " + semaforo.procesoActual.rafaga + " Cola: " + nomCola;
    }
    document.getElementById("SeccionCritica").innerHTML = texto;
    for (var i = 0; i < len; i++) {
        texto = "";
        var plan = semaforo.planificadores[i];
        pre = plan.cabeza;
        pos = plan.cabeza.siguiente;
        while (pos !== plan.cabeza) {
            texto += "Proceso: "+pos.nombre + " T.rafaga: " + pos.rafaga+"<br>";
            pre = pos;
            pos = pos.siguiente;
        }
        document.getElementById("proceso-" + i).innerHTML = texto;
    }
    pre = semaforo.bloqueado;
    pos = semaforo.bloqueado.siguiente;
    texto = "";
    while (pos !== semaforo.bloqueado) {
        texto += "Proceso: " + pos.nombre + " T.rafaga: " + pos.rafaga + "T.Bloqueo: " + pos.rafagaBloqueado + "<br>";
        pre = pos;
        pos = pos.siguiente;
    }
    document.getElementById("bloqueados1").innerHTML = texto;
    pre = semaforo.listo;
    pos = semaforo.listo.siguiente;
    texto = "";
    while (pos !== semaforo.listo) {
      numCola = pos.cola;
      nomCola = "";
      switch (numCola) {
        case numCola = 0:
          nomCola = "Fifo";
          break;
        case numCola = 1:
          nomCola = "R.Robbin";
          break;
        case numCola = 2:
          nomCola = "SJF";
          break;
        default:
          nomCola = "SJF";
          break;

      }
        texto += "Proceso: "+pos.nombre+" Cola: "+nomCola+"<br>";
        pre = pos;
        pos = pos.siguiente;
    }
    document.getElementById("terminados1").innerHTML = texto;
};
var informacionTimeLine = function (semaforo, tiempo) {
    if (semaforo.procesoActual !== null) {
        if (semaforo.procesoActual.nombre === procesoAnterior) {
            var len = informacionGrafica[semaforo.procesoActual.nombre].length;
            informacionGrafica[semaforo.procesoActual.nombre][len - 1].transcurrido++;
        }
        else {
            if (informacionGrafica[semaforo.procesoActual.nombre]) {
                var len = informacionGrafica[semaforo.procesoActual.nombre].length;
                var informacion = informacionGrafica[semaforo.procesoActual.nombre][len - 1];
                var transcurrido = 0;
                if (tiempo - semaforo.procesoActual.llegada <= 0) {
                    transcurrido = tiempo;
                }
                else {
                    transcurrido = semaforo.procesoActual.llegada;
                }
                if (semaforo.procesoActual.llegada - (informacion.inicio + informacion.transcurrido) > 0) {
                    informacionGrafica[semaforo.procesoActual.nombre].push({
                        nombre: "Bloqueo",
                        inicio: informacion.inicio + informacion.transcurrido,
                        transcurrido: transcurrido - (informacion.inicio + informacion.transcurrido)
                    });
                }
            }
            else {
                informacionGrafica[semaforo.procesoActual.nombre] = [];
            }
            if (tiempo - semaforo.procesoActual.llegada > 0) {
                informacionGrafica[semaforo.procesoActual.nombre].push({
                    nombre: "Espera",
                    inicio: semaforo.procesoActual.llegada,
                    transcurrido: tiempo - semaforo.procesoActual.llegada
                });
            }
            informacionGrafica[semaforo.procesoActual.nombre].push({
                cola: semaforo.planificadores[semaforo.procesoActual.cola].nombre,
                nombre: "Ejecucion",
                inicio: tiempo,
                transcurrido: 1
            });
            procesoAnterior = semaforo.procesoActual.nombre;
        }
    }
    else {
        procesoAnterior = "";
    }
    pintarGrafica(informacionGrafica);
};
var informacionTabla = function () {
    var texto = "<tr><td>Nombre</td><td>Cola</td><td>Tiempo Comienzo</td><td>Tiempo Finalizacion</td><td>Tiempo Rafaga</td><td>Tiempo Espera</td><td>Tiempo Bloqueo</td></tr>";
    var ejecucion;
    var bloqueo;
    var espera;
    var inicio;
    var final;
    var cola;
    var len;
    for (var key in informacionGrafica) {
        ejecucion = 0;
        bloqueo = 0;
        espera = 0;
        inicio = 0;
        final = 0;
        cola = "";
        len = informacionGrafica[key].length;
        for (var i = 0; i < len; i++) {
            var item = informacionGrafica[key][i];
            if (i === 0) {
                inicio = item.inicio;
            }
            if (i === len - 1) {
                final = item.inicio + item.transcurrido;
            }
            switch (item.nombre) {
                case "Ejecucion":
                    ejecucion += item.transcurrido;
                    cola = item.cola;
                    break;
                case "Bloqueo":
                    bloqueo += item.transcurrido;
                    break;
                case "Espera":
                    espera += item.transcurrido;
                    break;
            }
        }

        texto += "<tr>";
        texto += "<td>" + key + "</td>";
        texto += "<td>" + cola + "</td>";
        texto += "<td>" + inicio + "</td>";
        texto += "<td>" + final + "</td>";
        texto += "<td>" + ejecucion + "</td>";
        texto += "<td>" + espera + "</td>";
        texto += "<td>" + bloqueo + "</td>";
        texto += "</tr>";
        document.getElementById("vrendimiento1").innerHTML = texto;
    }
};
