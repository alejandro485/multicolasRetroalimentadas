abstract class Planificacion {

    public cabeza: Nodo;
    public nombre: string;

    constructor() {
        this.cabeza = new Nodo();
        this.cabeza.llegada = 0;
        this.cabeza.nombre = "cabeza";
        this.cabeza.prioridad = 0;
        this.cabeza.rafaga = 0;
        this.cabeza.rafagaBloqueado = 0;
        this.cabeza.siguiente = this.cabeza;
    }

    public abstract agregar(nodo: Nodo): void;

    public abstract gestionCompetencia(nuevo: Nodo, actual: Nodo): Nodo;

    public gestionActual(proceso: Nodo, tiempo: number): boolean {
        return false;
    }

    public remover(): Nodo {
        let removido: Nodo = this.cabeza.siguiente;
        this.cabeza.siguiente = removido.siguiente;
        return removido
    }

    public validarEnvejecimiento(tiempoActua: number, diferencia: number): boolean {
        let pos: Nodo = this.cabeza.siguiente;
        if(this.cabeza !== this.cabeza.siguiente) {
            return (pos.llegada < tiempoActua && tiempoActua - pos.llegada >= diferencia);
        }
        return false;
    }
}
