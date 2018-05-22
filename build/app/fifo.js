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
var Fifo = (function (_super) {
    __extends(Fifo, _super);
    function Fifo() {
        var _this = _super.call(this) || this;
        _this.nombre = "fifo";
        return _this;
    }
    Fifo.prototype.agregar = function (nodo) {
        var pre = this.cabeza;
        var pos = this.cabeza.siguiente;
        while (pos !== this.cabeza) {
            pre = pos;
            pos = pos.siguiente;
        }
        nodo.siguiente = this.cabeza;
        pre.siguiente = nodo;
    };
    Fifo.prototype.gestionCompetencia = function (nuevo, actual) {
        this.agregar(nuevo);
        return actual;
    };
    return Fifo;
}(Planificacion));
