class SJF extends Planificacion {
	constructor(){
		super();
		this.nombre = "SJF";
	}
	public gestionCompetencia(nuevo: Nodo, actual: Nodo): Nodo {
		this.agregar(nuevo);
		return actual;
	}
	public agregar(nodo : Nodo) : void{
		let pre : Nodo = this.cabeza;//revisar
		let pos : Nodo = this.cabeza.siguiente;
		while(pos !== this.cabeza) {
			if (nodo.rafaga < pos.rafaga) {
				nodo.siguiente = pos;
				pre.siguiente = nodo;
				return;
			}
			pre = pos;
			pos = pos.siguiente;
		}
		nodo.siguiente = pos;
		pre.siguiente = nodo;
	}

}
