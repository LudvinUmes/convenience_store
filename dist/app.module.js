"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const productos_module_1 = require("./productos/productos.module");
const categoria_module_1 = require("./categorias/categoria.module");
const lotes_module_1 = require("./lotes/lotes.module");
const marcas_module_1 = require("./marcas/marcas.module");
const recetas_module_1 = require("./recetas/recetas.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [productos_module_1.ProductosModule, categoria_module_1.CategoriasModule, lotes_module_1.LotesModule, marcas_module_1.MarcasModule, recetas_module_1.RecetasModule],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map