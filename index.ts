let informacionGrafica: any = {};
let procesoAnterior: string = "";
const main = function() {
    informacionGrafica = {};
    procesoAnterior = "";
    document.getElementById("procesoActual").innerHTML = "";
    document.getElementById("proceso-0").innerHTML = "";
    document.getElementById("proceso-1").innerHTML = "";
    document.getElementById("proceso-2").innerHTML = "";
    document.getElementById("bloqueado").innerHTML = "";
    document.getElementById("listos").innerHTML = "";
    document.getElementById("tablaProcesos").innerHTML = "";
    let semaforo: Semaforo = new Semaforo();
    let len: number = semaforo.planificadores.length;
    let total: number = 10;
    let tiempo: number = 0;
    let time = setInterval(() => {
        semaforo.transcurrirTiempo();
        if (total > 0) {
            let nodo: Nodo = new Nodo();
            nodo.cola = (Math.round(Math.random()*100) % len);
            nodo.llegada = tiempo;
            nodo.nombre = "proceso-"+Math.round(Math.random()*100)+""+tiempo+""+Math.round(Math.random()*100);
            nodo.prioridad = 1;
            nodo.rafaga = Math.round(Math.random()*8)+1 ;
            nodo.transcurrido = 0;
            nodo.siguiente = null;
            semaforo.agregarNodo(nodo);
            total--;
        }
        semaforo.validarEnvejecimiento();
        informacionDivs(semaforo, tiempo);
        informacionTimeLine(semaforo, tiempo);
        informacionTabla();
        tiempo ++;
        if (semaforo.procesoActual === null && semaforo.bloqueado === semaforo.bloqueado.siguiente) {
            clearInterval(time);
        }
    }, 1000);
};

const informacionDivs = (semaforo: Semaforo, tiempo: number) => {
    let len: number = semaforo.planificadores.length;
    let texto: string = "";
    let pre: Nodo;
    let pos: Nodo;
    if (semaforo.procesoActual === null) {
        texto = "sin proceso actual";
    } else {
        texto = semaforo.procesoActual.nombre+", "+semaforo.procesoActual.rafaga+" ("+semaforo.procesoActual.cola+")";
    }
    document.getElementById("procesoActual").innerHTML = texto;

    for(let i = 0; i< len; i++){
        texto = "";
        let plan: Planificacion = semaforo.planificadores[i];
        pre = plan.cabeza;
        pos = plan.cabeza.siguiente;
        while(pos !== plan.cabeza) {
            texto += "<li>"+pos.nombre+": "+pos.rafaga+"</li>";
            pre = pos;
            pos = pos.siguiente;
        }
        document.getElementById("proceso-"+i).innerHTML = texto;
    }

    pre = semaforo.bloqueado;
    pos = semaforo.bloqueado.siguiente;
    texto = "";
    while(pos !== semaforo.bloqueado) {
        texto += "<li>"+pos.nombre+": "+pos.rafaga+", "+pos.rafagaBloqueado+"</li>";
        pre = pos;
        pos = pos.siguiente;
    }
    document.getElementById("bloqueado").innerHTML = texto;

    pre = semaforo.listo;
    pos = semaforo.listo.siguiente;
    texto = "";
    while(pos !== semaforo.listo) {
        texto += "<li>"+pos.nombre+"</li>";
        pre = pos;
        pos = pos.siguiente;
    }
    document.getElementById("listos").innerHTML = texto;
}

const informacionTimeLine = (semaforo: Semaforo, tiempo: number) => {
    if (semaforo.procesoActual !== null) {
        if(semaforo.procesoActual.nombre === procesoAnterior) {
            let len = informacionGrafica[semaforo.procesoActual.nombre].length;
            informacionGrafica[semaforo.procesoActual.nombre][len - 1].transcurrido++;
        } else {
            if (informacionGrafica[semaforo.procesoActual.nombre]) {
                let len = informacionGrafica[semaforo.procesoActual.nombre].length;
                let informacion = informacionGrafica[semaforo.procesoActual.nombre][len - 1];
                let transcurrido: number = 0;
                if(tiempo - semaforo.procesoActual.llegada <= 0) {
                    transcurrido = tiempo;
                } else {
                    transcurrido = semaforo.procesoActual.llegada;
                }
                if (semaforo.procesoActual.llegada - (informacion.inicio + informacion.transcurrido) > 0) {
                    informacionGrafica[semaforo.procesoActual.nombre].push({
                        nombre: "Bloqueo",
                        inicio: informacion.inicio + informacion.transcurrido,
                        transcurrido: transcurrido - (informacion.inicio + informacion.transcurrido)
                    });
                }
            } else {
                informacionGrafica[semaforo.procesoActual.nombre] = [];
            }
            if(tiempo - semaforo.procesoActual.llegada > 0) {
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
    } else {
        procesoAnterior = "";
    }
    pintarGrafica(informacionGrafica);
};

const informacionTabla = () => {
    let texto: string = "";
    let ejecucion: number;
    let bloqueo: number;
    let espera: number;
    let inicio: number;
    let final: number;
    let cola: string;
    let len: number;
    for(var key in informacionGrafica) {
        ejecucion = 0;
        bloqueo = 0;
        espera = 0;
        inicio = 0;
        final = 0;
        cola = "";
        len = informacionGrafica[key].length;
        for (let i = 0; i<len; i++) {
            let item = informacionGrafica[key][i];
            if (i === 0) {
                inicio = item.inicio;
            }
            if (i === len - 1) {
                final = item.inicio + item.transcurrido;
            }
            switch(item.nombre) {
                case "Ejecucion":
                    ejecucion+=item.transcurrido;
                    cola = item.cola;
                break;
                case "Bloqueo":
                    bloqueo+=item.transcurrido;
                break;
                case "Espera":
                    espera+=item.transcurrido;
                break;
            }
        }
        texto += "<tr>";
        texto += "<td>"+key+"</td>";
        texto += "<td>"+cola+"</td>";
        texto += "<td>"+inicio+"</td>";
        texto += "<td>"+final+"</td>";
        texto += "<td>"+ejecucion+"</td>";
        texto += "<td>"+espera+"</td>";
        texto += "<td>"+bloqueo+"</td>";
        texto += "</tr>";
        document.getElementById("tablaProcesos").innerHTML=texto;
    }
};
