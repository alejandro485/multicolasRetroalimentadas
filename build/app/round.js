var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Round = (function (_super) {
    __extends(Round, _super);
    function Round() {
        var _this = _super.call(this) || this;
        _this.quantum = 4;
        _this.nombre = "Round";
        return _this;
    }
    Round.prototype.agregar = function (nodo) {
        var pre = this.cabeza;
        var pos = this.cabeza.siguiente;
        while (pos !== this.cabeza) {
            pre = pos;
            pos = pos.siguiente;
        }
        nodo.siguiente = this.cabeza;
        pre.siguiente = nodo;
    };
    Round.prototype.gestionCompetencia = function (nuevo, actual) {
        this.agregar(nuevo);
        return actual;
    };
    Round.prototype.gestionActual = function (proceso, tiempo) {
        if (proceso.transcurrido !== 0 && proceso.transcurrido % this.quantum === 0) {
            alert("Proceso "+proceso.nombre+" se ha roto por el quantum");
            var nodo = new Nodo();
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
    };
    return Round;
}(Planificacion));
