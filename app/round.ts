class Round extends Planificacion {

    public quantum: number;

    constructor() {
        super();
        this.quantum = 4;
        this.nombre = "Round";
    }

    public agregar(nodo: Nodo): void {
        let pre: Nodo = this.cabeza;
        let pos: Nodo = this.cabeza.siguiente;
        while(pos !== this.cabeza){
            pre = pos;
            pos = pos.siguiente;
        }
        nodo.siguiente = this.cabeza;
        pre.siguiente = nodo;
    }
    public gestionCompetencia(nuevo: Nodo, actual: Nodo): Nodo {
        this.agregar(nuevo);
        return actual;
    }
    public gestionActual(proceso: Nodo, tiempo: number): boolean {
        if (proceso.transcurrido !== 0 && proceso.transcurrido % this.quantum === 0) {
            let nodo: Nodo = new Nodo();
            nodo.cola = proceso.cola;
            nodo.llegada = tiempo;
            nodo.nombre = proceso.nombre;
            nodo.prioridad = proceso.prioridad;
            nodo.rafaga = proceso.rafaga;
            nodo.rafagaBloqueado = 0;
            nodo.transcurrido = 0;
            nodo.siguiente = null;
            this.agregar(nodo);
            return true;
        }
        return false;
    }

}
