"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecetasModule = void 0;
const common_1 = require("@nestjs/common");
const recetas_controller_1 = require("./recetas.controller");
const recetas_service_1 = require("./recetas.service");
const prisma_service_1 = require("../prisma/prisma.service");
let RecetasModule = class RecetasModule {
};
exports.RecetasModule = RecetasModule;
exports.RecetasModule = RecetasModule = __decorate([
    (0, common_1.Module)({
        controllers: [recetas_controller_1.RecetasController],
        providers: [recetas_service_1.RecetasService, prisma_service_1.PrismaService],
    })
], RecetasModule);
//# sourceMappingURL=recetas.module.js.map