class Fifo extends Planificacion {

    constructor() {
        super();
        this.nombre = "fifo";
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
}