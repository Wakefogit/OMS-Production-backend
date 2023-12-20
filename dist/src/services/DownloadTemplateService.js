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
exports.DownloadTemplateService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
let DownloadTemplateService = class DownloadTemplateService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_downloadTemplate;
    }
    getDownloadTemplate(name, isUser, exceptHearder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataObj = {
                    // attributes: ["name", "columnName"],
                    distinct: true,
                    model: models_1.default.tbl_downloadTemplate,
                    where: {
                        isDeleted: Appconstants_1.default.ZERO,
                        name: name
                    },
                    required: false,
                    raw: true
                };
                if (!(0, Utils_1.isArrayPopulated)(name)) {
                    delete dataObj.where.name;
                }
                if (isUser) {
                    dataObj.where['and'] = sequelize_1.Sequelize.literal(`
                    [tbl_downloadTemplate].name not in ('${exceptHearder}')
                `);
                }
                let query = yield models_1.default.tbl_downloadTemplate.findAll(dataObj);
                // console.log("query ", query);
                return query;
            }
            catch (error) {
                console.log("Error_in_getDownloadTemplate ", error);
                throw error;
            }
        });
    }
};
DownloadTemplateService = __decorate([
    (0, typedi_1.Service)()
], DownloadTemplateService);
exports.DownloadTemplateService = DownloadTemplateService;
//# sourceMappingURL=DownloadTemplateService.js.map