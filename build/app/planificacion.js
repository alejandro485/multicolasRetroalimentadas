var Planificacion = (function () {
    function Planificacion() {
        this.cabeza = new Nodo();
        this.cabeza.llegada = 0;
        this.cabeza.nombre = "cabeza";
        this.cabeza.prioridad = 0;
        this.cabeza.rafaga = 0;
        this.cabeza.rafagaBloqueado = 0;
        this.cabeza.siguiente = this.cabeza;
    }
    Planificacion.prototype.gestionActual = function (proceso, tiempo) {
        return false;
    };
    Planificacion.prototype.remover = function () {
        var removido = this.cabeza.siguiente;
        this.cabeza.siguiente = removido.siguiente;
        return removido;
    };
    Planificacion.prototype.validarEnvejecimiento = function (tiempoActua, diferencia) {
        var pos = this.cabeza.siguiente;
        if (this.cabeza !== this.cabeza.siguiente) {
            return (pos.llegada < tiempoActua && tiempoActua - pos.llegada >= diferencia);
        }
        return false;
    };
    return Planificacion;
}());
