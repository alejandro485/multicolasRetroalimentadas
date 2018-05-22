class Semaforo {
    public procesoActual: Nodo;
    public bloqueado: Nodo;
    public listo: Nodo;
    public planificadores: Planificacion[];
    public tiempoEnvejecimiento: number;
    public tiempo: number;

    constructor() {
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

    public transcurrirTiempo(): void {
        this.tiempo++;
        if (this.procesoActual === null) {
            this.signal();
        } else {
            this.procesoActual.rafaga--;
            this.procesoActual.transcurrido++;
            if (this.procesoActual.rafaga === 0) {
                this.signal();
            } else if (this.planificadores[this.procesoActual.cola].gestionActual(this.procesoActual, this.tiempo)) {
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
    }

    public agregarNodo(nodo: Nodo): void {
        if (this.procesoActual !== null) {
            if (nodo.cola < this.procesoActual.cola) {
                let expulsado: Nodo = this.procesoActual;
                this.procesoActual = nodo;
                expulsado.llegada = nodo.llegada;
                expulsado.transcurrido = 0;
                this.planificadores[expulsado.cola].agregar(expulsado);
            } else if (nodo.cola === this.procesoActual.cola){
                this.procesoActual = this.planificadores[nodo.cola].gestionCompetencia(nodo, this.procesoActual);
            } else {
                this.planificadores[nodo.cola].agregar(nodo);
            }
        } else {
            this.procesoActual = nodo;
        }
    }

    public bloquear(): void {
        let nodo: Nodo = new Nodo();
        nodo.cola = this.procesoActual.cola;
        nodo.rafagaBloqueado = Math.round(Math.random() * 8) + 2;
        nodo.nombre = this.procesoActual.nombre;
        nodo.prioridad = this.procesoActual.prioridad;
        nodo.rafaga = this.procesoActual.rafaga;
        nodo.transcurrido = 0;
        let pre: Nodo = this.bloqueado;
        let pos: Nodo = this.bloqueado.siguiente;
        while(pos !== this.bloqueado) {
            if(this.procesoActual.rafagaBloqueado < pos.rafagaBloqueado) {
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
    }

    public reducirBloqueo(): void {
        let pre: Nodo = this.bloqueado;
        let pos: Nodo = this.bloqueado.siguiente;
        while(pos !== this.bloqueado) {
            pos.rafagaBloqueado--;
            pre = pos;
            pos = pos.siguiente;
        }
        while(true) {
            pos = this.bloqueado.siguiente;
            if(pos !== this.bloqueado) {
                if (pos.rafagaBloqueado <= 0) {
                    this.bloqueado.siguiente = pos.siguiente;
                    pos.llegada = this.tiempo;
                    this.agregarNodo(pos);
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    }

    public signal(): void {
        if (this.procesoActual && this.procesoActual.rafaga <= 0) {
            let pre: Nodo = this.listo;
            let pos: Nodo = this.listo.siguiente;
            while(pos !== this.listo) {
                pre = pos;
                pos = pos.siguiente;
            }
            this.procesoActual.siguiente = this.listo;
            pre.siguiente = this.procesoActual;
        }
        this.procesoActual = null;
        let len = this.planificadores.length;
        for (let i = 0; i< len; i++) {
            let removido: Nodo = this.planificadores[i].remover();
            if(removido !== this.planificadores[i].cabeza){
                this.agregarNodo(removido);
                break;
            }
        }
    }

    public validarEnvejecimiento(): void {
        let len: number = this.planificadores.length;
        for(let  i = 1; i < len; i++) {
            if(this.planificadores[i].validarEnvejecimiento(this.tiempo, this.tiempoEnvejecimiento)) {
                let removido: Nodo = this.planificadores[i].remover();
                removido.cola = i - 1;
                removido.llegada = this.tiempo;
                this.agregarNodo(removido);
            }
        }
    }

}