"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const sequelize_1 = require("sequelize");
const Enums_1 = require("../enums/Enums");
let RoleService = class RoleService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_role;
    }
    roleList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield models_1.default.tbl_role.findAll({
                    attributes: [
                        ['uniqueKey', 'roleId'],
                        "name", "description",
                        "isActive"
                    ],
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        id: {
                            [sequelize_1.Op.not]: Enums_1.role.Admin
                        }
                    },
                    order: [["id", "ASC"]],
                    raw: true
                });
                return result;
            }
            catch (error) {
                console.log("Error in roleList ", error);
                throw error;
            }
        });
    }
    getRoleIncludes(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    model: models_1.default.tbl_role,
                    attributes: [],
                    distinct: true,
                    required: true,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        uniqueKey: roleId
                    },
                    raw: true
                };
                // if(!isArrayPopulated(roleId)) {
                //     delete includes.where["uniqueKey"]
                // }    
                return includes;
            }
            catch (error) {
                console.log("Error in getRoleIncludes ", error);
                throw error;
            }
        });
    }
};
RoleService = __decorate([
    (0, typedi_1.Service)()
], RoleService);
exports.RoleService = RoleService;
//# sourceMappingURL=RoleService.js.map