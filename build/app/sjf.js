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
var SJF = (function (_super) {
    __extends(SJF, _super);
    function SJF() {
        var _this = _super.call(this) || this;
        _this.nombre = "SJF";
        return _this;
    }
    SJF.prototype.gestionCompetencia = function (nuevo, actual) {
        this.agregar(nuevo);
        return actual;
    };
    SJF.prototype.agregar = function (nodo) {
        var pre = this.cabeza;
        var pos = this.cabeza.siguiente;
        while (pos !== this.cabeza) {
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
    };
    return SJF;
}(Planificacion));
