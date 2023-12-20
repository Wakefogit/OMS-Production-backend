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
exports.QAService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const Enums_1 = require("../enums/Enums");
const sequelize_1 = require("sequelize");
const PpcService_1 = require("./PpcService");
let ppcService = new PpcService_1.PpcService();
let QAService = class QAService extends BaseService_1.default {
    getModel() {
        return models_1.default.qa;
    }
    createOrUpdateQaData(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                let qaData;
                if (orderData) {
                    let qaObj = new models_1.default.tbl_qa();
                    qaObj.orderId = orderData.id;
                    qaObj.remarks = input["remarks"];
                    qaObj.isDeleted = Appconstants_1.default.ZERO;
                    if (currentUser["roleId"] == Appconstants_1.default.ONE) {
                        qaObj.updatedAdminId = currentUser["id"];
                        qaObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    if (input["qaId"] && input["qaId"] != "") {
                        qaData = yield this.findUniqueKey(models_1.default.tbl_qa, input["qaId"]);
                    }
                    if (qaData) {
                        qaObj.id = qaData.id;
                        qaObj.updatedBy = currentUser["id"];
                        qaObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        qaObj.uniqueKey = (0, Utils_1.uuidv4)();
                        qaObj.createdBy = currentUser["id"];
                        qaObj.createdOn = new Date(new Date().toUTCString());
                    }
                    // if (input['plannedQuenching'] || input['plannedInternalAlloy'] ||
                    //     (input['frontEndCoringLength'] >= AppConstants.ZERO && input['frontEndCoringLength'] != null)
                    //     || (input['backEndCoringLength'] >= AppConstants.ZERO && input['backEndCoringLength'] != null)) {
                    let result2 = yield this.updatePpcData(input, orderData.id, currentUser['id'], currentUser['roleId'], tran);
                    // }
                    // if ((input['cut_len_tolerance_upper'] >= AppConstants.ZERO && input['cut_len_tolerance_upper'] != null) ||
                    //     (input['cut_len_tolerance_lower'] >= AppConstants.ZERO && input['cut_len_tolerance_lower'] != null)) {
                    let result3 = yield this.updateOrderDatas(input, orderData.id, currentUser['id'], currentUser['roleId'], tran);
                    // }
                    console.log("qaObj", qaObj);
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_qa, qaObj, tran);
                    if (result)
                        return {
                            "message": Appconstants_1.default.UPDATED_SUCCESSFULLY,
                            "uniqueKey": result.uniqueKey
                        };
                    // return AppConstants.UPDATED_SUCCESSFULLY;
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
    getQAData(orderId, userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    id: orderId,
                    // createdBy: userId
                };
                // let query = await db.tbl_ppc.findOne({
                //     attributes: [
                //         // ['uniqueKey', 'qaId'], 
                //         // "remarks",
                //         "plannedQuenching",
                //         "plannedInternalAlloy",
                //         "frontEndCoringLength",
                //         "backEndCoringLength",
                //         [Sequelize.literal(`
                //         (SELECT uniqueKey from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_QA} tq 
                //             where tq.isDeleted =${AppConstants.ZERO} and tq.isActive = ${AppConstants.ONE} 
                //             and tq.orderId = ${orderId} )
                //         `), "qaId"],
                //         [Sequelize.literal(`
                //         (SELECT remarks from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_QA} tq 
                //             where tq.isDeleted =${AppConstants.ZERO} and tq.isActive = ${AppConstants.ONE} 
                //             and tq.orderId = ${orderId} )
                //         `), "remarks"],
                //         [Sequelize.literal(`
                //         (SELECT cut_len_tolerance_upper 
                //             from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_ORDER} tol 
                //             where tol.isDeleted =${AppConstants.ZERO} and tol.isActive = ${AppConstants.ONE} 
                //                 and tol.id = ${orderId})
                //         `), "cutLengthToleranceUpper"],
                //         [Sequelize.literal(`
                //         (SELECT cut_len_tolerance_lower 
                //             from ${AppConstants.DB_JINDAL}.dbo.${AppConstants.TBL_ORDER} tol 
                //             where tol.isDeleted =${AppConstants.ZERO} and tol.isActive = ${AppConstants.ONE} 
                //                 and tol.id = ${orderId})
                //         `), "cutLengthToleranceLower"]
                //     ],
                //     distinct: true,
                //     model: db.tbl_ppc,
                //     where: whereCondition,
                //     required: true,
                //     raw: true
                // })
                let dataObj = {
                    attributes: [
                        [sequelize_1.Sequelize.literal("tbl_qa.uniqueKey"), "qaId"],
                        [sequelize_1.Sequelize.literal("tbl_qa.remarks"), "remarks"],
                        ["cut_len_tolerance_lower", 'cutLengthToleranceLower'],
                        ["cut_len_tolerance_upper", 'cutLengthToleranceUpper'],
                        [sequelize_1.Sequelize.literal('tbl_ppc.plannedQuenching'), 'plannedQuenching'],
                        [sequelize_1.Sequelize.literal('tbl_ppc.plannedInternalAlloy'), 'plannedInternalAlloy'],
                        [sequelize_1.Sequelize.literal('tbl_ppc.frontEndCoringLength'), 'frontEndCoringLength'],
                        [sequelize_1.Sequelize.literal('tbl_ppc.backEndCoringLength'), 'backEndCoringLength'],
                    ],
                    distinct: true,
                    model: models_1.default.tbl_order,
                    where: whereCondition,
                    required: true,
                    raw: true
                };
                dataObj["include"] = [
                    yield ppcService.getPPCIncludes(),
                    yield this.getQAIncludes(),
                ];
                let query = yield models_1.default.tbl_order.findOne(dataObj);
                return query;
            }
            catch (error) {
                console.log("Error_in_getQAData ", error);
                throw error;
            }
        });
    }
    getQAAttributes(isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let attributes = [
                    [sequelize_1.Sequelize.literal('tbl_qa.uniqueKey'), 'qaId'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_qa.remarks,'#','')" : 'tbl_qa.remarks'}`), "qaRemarks"]
                ];
                return attributes;
            }
            catch (error) {
                console.log("Error_in_getQAAttributes ", error);
                throw error;
            }
        });
    }
    getQAIncludes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_qa,
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
                console.log("Error_in_getQAIncludes ", error);
                throw error;
            }
        });
    }
    updatePpcData(input, orderId, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result;
                let ppcData = yield models_1.default.tbl_ppc.findOne({
                    where: {
                        isDeleted: Appconstants_1.default.ZERO,
                        isActive: Appconstants_1.default.ONE,
                        orderId: orderId,
                    },
                    raw: true
                });
                console.log("ppcData", ppcData);
                if (ppcData) {
                    // let ppcId = ppcData.id
                    let ppcObj = new models_1.default.tbl_ppc();
                    ppcObj.id = ppcData.id;
                    ppcObj.uniqueKey = ppcData.uniqueKey;
                    ppcObj.plannedQuenching = input["plannedQuenching"];
                    ppcObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                    ppcObj.frontEndCoringLength = input["frontEndCoringLength"];
                    ppcObj.backEndCoringLength = input["backEndCoringLength"];
                    if (roleId == Enums_1.role.Admin) {
                        ppcObj.adminUpdatedOn = new Date(new Date().toUTCString());
                        ppcObj.updatedAdminId = userId;
                    }
                    else {
                        ppcObj.updatedBy = userId;
                        ppcObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    // console.log("ppcObj ",ppcObj)
                    result = yield this.createOrUpdateByModel(models_1.default.tbl_ppc, ppcObj, tran);
                }
                else {
                    let ppcObj = new models_1.default.tbl_ppc();
                    // ppcObj.id = ppcData.id;
                    ppcObj.uniqueKey = (0, Utils_1.uuidv4)();
                    ppcObj.orderId = orderId;
                    ppcObj.plannedQuenching = input["plannedQuenching"];
                    ppcObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                    ppcObj.frontEndCoringLength = input["frontEndCoringLength"];
                    ppcObj.backEndCoringLength = input["backEndCoringLength"];
                    if (roleId == Enums_1.role.Admin) {
                        ppcObj.adminUpdatedOn = new Date(new Date().toUTCString());
                        ppcObj.updatedAdminId = userId;
                        ppcObj.createdBy = userId;
                        ppcObj.createdOn = new Date(new Date().toUTCString());
                    }
                    else {
                        ppcObj.createdBy = userId;
                        ppcObj.createdOn = new Date(new Date().toUTCString());
                    }
                    // console.log("ppcObj ",ppcObj)
                    result = yield this.createOrUpdateByModel(models_1.default.tbl_ppc, ppcObj, tran);
                }
                return result;
            }
            catch (error) {
                console.log("Error in updatePpcData" + error);
                throw error;
            }
        });
    }
    updateOrderDatas(input, orderId, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderObj = new models_1.default.tbl_order();
                orderObj.id = orderId;
                orderObj.cut_len_tolerance_upper = input["cut_len_tolerance_upper"];
                orderObj.cut_len_tolerance_lower = input["cut_len_tolerance_lower"];
                if (roleId == Appconstants_1.default.ONE) {
                    orderObj.updatedAdminId = userId;
                    orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }
                else {
                    orderObj.updatedOn = new Date(new Date().toUTCString());
                    orderObj.updatedBy = userId;
                }
                let result = yield this.createOrUpdateByModel(models_1.default.tbl_order, orderObj, tran);
                return result;
            }
            catch (error) {
                console.log("Error in updateOrderDatas" + error);
                throw error;
            }
        });
    }
    getQAFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let qaFilter = {
                '$[tbl_qa].remarks$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_qa].[remarks],'') LIKE N'%${input["fqaRemarks"]}%' )
            `),
            };
            return qaFilter;
        });
    }
};
QAService = __decorate([
    (0, typedi_1.Service)()
], QAService);
exports.QAService = QAService;
//# sourceMappingURL=QAService.js.map