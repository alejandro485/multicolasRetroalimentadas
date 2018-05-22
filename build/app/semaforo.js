var Semaforo = (function () {
    function Semaforo() {
        this.tiempoEnvejecimiento = 20;
        this.tiempo = 0;
        this.planificadores = [];
        this.planificadores.push(new Fifo());
        this.planificadores.push(new Round());
        this.planificadores.push(new SJF());
        this.procesoActual = null;
        this.bloqueado = new Nodo();
        this.bloqueado.llegada = 0;
        this.bloqueado.nombre = "bloqueado";
        this.bloqueado.siguiente = this.bloqueado;
        this.listo = new Nodo();
        this.listo.llegada = 0;
        this.listo.nombre = "listo";
        this.listo.siguiente = this.listo;
    }
    Semaforo.prototype.transcurrirTiempo = function () {
        this.tiempo++;
        if (this.procesoActual === null) {
            this.signal();
        }
        else {
            this.procesoActual.rafaga--;
            this.procesoActual.transcurrido++;
            if (this.procesoActual.rafaga === 0) {
                this.signal();
            }
            else if (this.planificadores[this.procesoActual.cola].gestionActual(this.procesoActual, this.tiempo)) {
                this.signal();
            }
            if (Math.random() >= 0.5
                && Math.random() >= 0.5
                && Math.random() >= 0.5
                && this.procesoActual !== null
                && this.procesoActual.transcurrido > 0) {
                this.bloquear();
            }
        }
        this.reducirBloqueo();
    };
    Semaforo.prototype.agregarNodo = function (nodo) {
        if (this.procesoActual !== null) {
            if (nodo.cola < this.procesoActual.cola) {
                var expulsado = this.procesoActual;
                this.procesoActual = nodo;
                expulsado.llegada = nodo.llegada;
                expulsado.transcurrido = 0;
                alert("Proceso "+expulsado.nombre+" expulsado por prioridad de colas");
                this.planificadores[expulsado.cola].agregar(expulsado);
            }
            else if (nodo.cola === this.procesoActual.cola) {
                this.procesoActual = this.planificadores[nodo.cola].gestionCompetencia(nodo, this.procesoActual);
            }
            else {
                this.planificadores[nodo.cola].agregar(nodo);
            }
        }
        else {
            this.procesoActual = nodo;
        }
    };
    Semaforo.prototype.bloquear = function () {
        var nodo = new Nodo();
        nodo.cola = this.procesoActual.cola;
        nodo.rafagaBloqueado = Math.round(Math.random() * 8) + 2;
        nodo.nombre = this.procesoActual.nombre;
        nodo.prioridad = this.procesoActual.prioridad;
        nodo.rafaga = this.procesoActual.rafaga;
        nodo.transcurrido = 0;
        var pre = this.bloqueado;
        var pos = this.bloqueado.siguiente;
        while (pos !== this.bloqueado) {
            if (this.procesoActual.rafagaBloqueado < pos.rafagaBloqueado) {
                nodo.siguiente = pos;
                pre.siguiente = nodo;
                this.signal();
            }
            pre = pos;
            pos = pos.siguiente;
        }
        nodo.siguiente = pos;
        pre.siguiente = nodo;
        this.signal();
    };
    Semaforo.prototype.reducirBloqueo = function () {
        var pre = this.bloqueado;
        var pos = this.bloqueado.siguiente;
        while (pos !== this.bloqueado) {
            pos.rafagaBloqueado--;
            pre = pos;
            pos = pos.siguiente;
        }
        while (true) {
            pos = this.bloqueado.siguiente;
            if (pos !== this.bloqueado) {
                if (pos.rafagaBloqueado <= 0) {
                    this.bloqueado.siguiente = pos.siguiente;
                    pos.llegada = this.tiempo;
                    this.agregarNodo(pos);
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
        }
    };
    Semaforo.prototype.signal = function () {
        if (this.procesoActual && this.procesoActual.rafaga <= 0) {
            var pre = this.listo;
            var pos = this.listo.siguiente;
            while (pos !== this.listo) {
                pre = pos;
                pos = pos.siguiente;
            }
            this.procesoActual.siguiente = this.listo;
            pre.siguiente = this.procesoActual;
        }
        this.procesoActual = null;
        var len = this.planificadores.length;
        for (var i = 0; i < len; i++) {
            var removido = this.planificadores[i].remover();
            if (removido !== this.planificadores[i].cabeza) {
                this.agregarNodo(removido);
                break;
            }
        }
    };
    Semaforo.prototype.validarEnvejecimiento = function () {
        var len = this.planificadores.length;
        for (var i = 1; i < len; i++) {
            if (this.planificadores[i].validarEnvejecimiento(this.tiempo, this.tiempoEnvejecimiento)) {
                var removido = this.planificadores[i].remover();
                removido.cola = i - 1;
                removido.llegada = this.tiempo;
                alert("Proceso "+removido.nombre+" removido de "+this.planificadores[i].nombre+" por envejecimiento a "+this.planificadores[i - 1].nombre);
                this.agregarNodo(removido);
            }
        }
    };
    return Semaforo;
}());
