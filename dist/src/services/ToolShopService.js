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
exports.ToolShopService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
let ToolShopService = class ToolShopService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_toolShop;
    }
    createOrUpdateToolShopData(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let toolShopData;
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                if (orderData) {
                    let toolShopDataObj = new models_1.default.tbl_toolShop();
                    toolShopDataObj.orderId = orderData.id;
                    toolShopDataObj.dieRefId = input["dieRefId"];
                    toolShopDataObj.noOfCavity = input["noOfCavity"];
                    toolShopDataObj.bolsterEntry = input["bolsterEntry"];
                    toolShopDataObj.backerEntry = input["backerEntry"];
                    toolShopDataObj.specialBackerEntry = input["specialBackerEntry"];
                    toolShopDataObj.ringEntry = input["ringEntry"];
                    toolShopDataObj.dieSetter = input["dieSetter"];
                    toolShopDataObj.weldingChamber = input["weldingChamber"];
                    toolShopDataObj.remarks = input["remarks"];
                    toolShopDataObj.isActive = input["isActive"];
                    toolShopDataObj.isDeleted = Appconstants_1.default.ZERO;
                    if (currentUser["roleId"] == Appconstants_1.default.ONE) {
                        toolShopDataObj.updatedAdminId = currentUser["id"];
                        toolShopDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    if (input["toolShopId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                        let toolShopId = input["toolShopId"] ? input["toolShopId"] : input["uniqueKey"];
                        toolShopData = toolShopId != "" ? yield this.findUniqueKey(models_1.default.tbl_toolShop, toolShopId) : undefined;
                    }
                    // console.log("toolShopData ",toolShopData)
                    if (toolShopData) {
                        toolShopDataObj.id = toolShopData.id;
                        toolShopDataObj.uniqueKey = toolShopData.uniqueKey;
                        toolShopDataObj.updatedBy = currentUser["id"];
                        toolShopDataObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        toolShopDataObj.uniqueKey = (0, Utils_1.uuidv4)();
                        toolShopDataObj.createdBy = currentUser["id"];
                        toolShopDataObj.createdOn = new Date(new Date().toUTCString());
                    }
                    // console.log("toolShopDataObj ",toolShopDataObj)
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_toolShop, toolShopDataObj, tran);
                    if (result)
                        return {
                            "message": Appconstants_1.default.UPDATED_SUCCESSFULLY,
                            "uniqueKey": result.uniqueKey
                        };
                    // return AppConstants.UPDATED_SUCCESSFULLY + '|' + result.uniqueKey;
                    else
                        return Appconstants_1.default.PROBLEM_WHILE_UPDATING;
                }
                else
                    return Appconstants_1.default.INVALID_ID;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getToolShopData(orderId, userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId,
                    // createdBy: userId
                };
                // (roleId == role.Admin || roleId > role.Tool_Shop) && delete whereCondition.createdBy
                let query = yield models_1.default.tbl_toolShop.findOne({
                    attributes: [
                        ["uniqueKey", 'toolShopId'],
                        "dieRefId",
                        // [Sequelize.literal(`
                        //     (SELECT description  
                        //         FROM tbl_reference tr 
                        //         WHERE tr.isDeleted = 0 AND tr.referenceGroupId = 2
                        //             AND tr.id = dieRefId)
                        // `), 'die'],
                        "noOfCavity", "bolsterEntry", "backerEntry",
                        "specialBackerEntry", "ringEntry", "dieSetter", "weldingChamber",
                        "remarks", "isActive"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_toolShop,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                return query;
            }
            catch (error) {
                console.log("Into_the_getToolShopData ", error);
                throw error;
            }
        });
    }
    getToolShopAttributes(isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let attributes = [
                    [sequelize_1.Sequelize.literal('tbl_toolShop.uniqueKey'), 'toolShopId'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.dieRefId,'#','')" : 'tbl_toolShop.dieRefId'}`), 'die'],
                    [sequelize_1.Sequelize.literal('tbl_toolShop.noOfCavity'), 'noOfCavity'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.bolsterEntry,'#','')" : 'tbl_toolShop.bolsterEntry'}`), 'bolsterEntry'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.backerEntry,'#','')" : 'tbl_toolShop.backerEntry'}`), 'backerEntry'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.specialBackerEntry,'#','')" : 'tbl_toolShop.specialBackerEntry'}`), 'specialBackerEntry'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.ringEntry,'#','')" : 'tbl_toolShop.ringEntry'}`), 'ringEntry'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.dieSetter,'#','')" : 'tbl_toolShop.dieSetter'}`), 'dieSetter'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.weldingChamber,'#','')" : 'tbl_toolShop.weldingChamber'}`), 'weldingChamber'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_toolShop.remarks,'#','')" : 'tbl_toolShop.remarks'}`), "toolShopRemarks"]
                ];
                return attributes;
            }
            catch (error) {
                console.log("Error_in_getToolShopAttributes ", error);
                throw error;
            }
        });
    }
    getToolShopIncludes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_toolShop,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO
                    },
                    required: false,
                    raw: true
                };
                return includes;
            }
            catch (error) {
                console.log("Error_in_getToolShopIncludes ", error);
                throw error;
            }
        });
    }
    getToolShopFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let toolshopFilter = {
                '$[tbl_toolShop].dieRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[dieRefId],'') LIKE N'%${input["fdieRefId"]}%' )
            `),
                '$[tbl_toolShop].noOfCavity$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[noOfCavity],0) LIKE N'%${input["fnoOfCavity"]}%' )
            `),
                '$[tbl_toolShop].bolsterEntry$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[bolsterEntry],'') LIKE N'%${input["fbolsterEntry"]}%' )
            `),
                '$[tbl_toolShop].backerEntry$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[backerEntry],'') LIKE N'%${input["fbackerEntry"]}%' )
            `),
                '$[tbl_toolShop].specialBackerEntry$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[specialBackerEntry],'') LIKE N'%${input["fspecialBackerEntry"]}%' )
            `),
                '$[tbl_toolShop].ringEntry$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[ringEntry],'') LIKE N'%${input["fringEntry"]}%' )
            `),
                '$[tbl_toolShop].dieSetter$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[dieSetter],'') LIKE N'%${input["fdieSetter"]}%' )
            `),
                '$[tbl_toolShop].weldingChamber$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[weldingChamber],'') LIKE N'%${input["fweldingChamber"]}%' )
            `),
                '$[tbl_toolShop].remarks$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_toolShop].[remarks],'') LIKE N'%${input["ftoolShopRemarks"]}%' )
            `),
            };
            return toolshopFilter;
        });
    }
};
ToolShopService = __decorate([
    (0, typedi_1.Service)()
], ToolShopService);
exports.ToolShopService = ToolShopService;
//# sourceMappingURL=ToolShopService.js.map