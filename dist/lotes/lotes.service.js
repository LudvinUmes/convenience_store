"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LoteService = class LoteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar() {
        return this.prisma.lote_productos.findMany();
    }
    async buscarPorId(id) {
        return this.prisma.lote_productos.findUnique({ where: { id } });
    }
    async crear(data) {
        return this.prisma.lote_productos.create({ data });
    }
    async actualizar(id, data) {
        return this.prisma.lote_productos.update({ where: { id }, data });
    }
};
exports.LoteService = LoteService;
exports.LoteService = LoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoteService);
//# sourceMappingURL=lotes.service.js.map