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
exports.PpcService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
const Enums_1 = require("../enums/Enums");
const OperatorEntryService_1 = require("./OperatorEntryService");
let operatorEntryService = new OperatorEntryService_1.OperatorEntryService();
let PpcService = class PpcService extends BaseService_1.default {
    getModel() {
        return models_1.default.PPC;
    }
    createOrUpdatePpcStatus(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ppcData;
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                if (orderData) {
                    let ppcDataObj = new models_1.default.tbl_ppc();
                    ppcDataObj.plantSelected = input["plantSelected"];
                    ppcDataObj.pressAllocationRefId = input["pressAllocationRefId"];
                    ppcDataObj.plannedQty = input["plannedQty"];
                    ppcDataObj.orderId = orderData.id;
                    ppcDataObj.plannedInternalAlloy = input["plannedInternalAlloy"];
                    ppcDataObj.plannedNoOfBilletAndLength = input["plannedNoOfBilletAndLength"] ? JSON.stringify(input["plannedNoOfBilletAndLength"]) : undefined;
                    ppcDataObj.productionRateRequired = input["productionRateRequired"];
                    ppcDataObj.plannedQuenching = input["plannedQuenching"];
                    ppcDataObj.frontEndCoringLength = input["frontEndCoringLength"];
                    ppcDataObj.backEndCoringLength = input["backEndCoringLength"];
                    // ppcDataObj.backEndCoringLength = (input["backEndCoringLength"] != null
                    //     && input["backEndCoringLength"] >= AppConstants.ZERO) ?
                    //     input["backEndCoringLength"] : undefined;
                    ppcDataObj.plantExtrusionLength = input["plantExtrusionLength"];
                    ppcDataObj.extrusionLengthRefId = input["extrusionLengthRefId"];
                    ppcDataObj.plannedButtThickness = input["plannedButtThickness"];
                    ppcDataObj.cutBilletsRefId = input["cutBilletsRefId"];
                    ppcDataObj.buttWeightPerInch = (0, Utils_1.isValueOrUndefined)(input["buttWeightPerInch"]);
                    ppcDataObj.remarks = input["remarks"];
                    ppcDataObj.isActive = input["isActive"];
                    ppcDataObj.isDeleted = Appconstants_1.default.ZERO;
                    if (currentUser["roleId"] == Appconstants_1.default.ONE) {
                        ppcDataObj.updatedAdminId = currentUser["id"];
                        ppcDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    if (input["ppcId"] != "") {
                        ppcData = yield this.findUniqueKey(models_1.default.tbl_ppc, input["ppcId"]);
                    }
                    if (ppcData) {
                        ppcDataObj.id = ppcData.id;
                        ppcDataObj.updatedBy = currentUser["id"];
                        ppcDataObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        ppcDataObj.uniqueKey = (0, Utils_1.uuidv4)();
                        ppcDataObj.createdBy = currentUser["id"];
                        ppcDataObj.createdOn = new Date(new Date().toUTCString());
                    }
                    // console.log("ppcDataObj", ppcDataObj);
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_ppc, ppcDataObj, tran);
                    if (result) {
                        (0, Utils_1.isValueOrUndefined)(input["priorityRefId"]) && (yield this.updateOrderPriority(input, orderData.id, currentUser["id"], currentUser["roleId"], tran));
                        (currentUser["roleId"] == Enums_1.role.Admin) && (yield operatorEntryService.updateDerivativeFields(orderData.id, ppcDataObj.buttWeightPerInch, tran));
                        return {
                            "message": Appconstants_1.default.UPDATED_SUCCESSFULLY,
                            "uniqueKey": result.uniqueKey
                        };
                        // return AppConstants.UPDATED_SUCCESSFULLY;
                    }
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
    getPPCData(orderId, userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId,
                    // createdBy: userId
                };
                // (roleId == role.Admin || roleId > role.PPC) && delete whereCondition.createdBy
                let query = yield models_1.default.tbl_ppc.findOne({
                    attributes: [
                        ["uniqueKey", 'ppcId'],
                        "plantSelected", "pressAllocationRefId", "plannedQty", "plannedInternalAlloy",
                        "plannedNoOfBilletAndLength", "productionRateRequired", "plannedQuenching",
                        "frontEndCoringLength", "backEndCoringLength", "plantExtrusionLength",
                        "extrusionLengthRefId",
                        "plannedButtThickness",
                        "cutBilletsRefId",
                        "buttWeightPerInch",
                        [sequelize_1.Sequelize.literal(`
                        (select priorityRefId
                        from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_ORDER} tbo
                        where tbo.isDeleted = 0 and tbo.isActive = 1
                            and tbo.id = tbl_ppc.orderId)
                    `), "priorityRefId"],
                        "remarks"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_ppc,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                return query;
            }
            catch (error) {
                console.log("Error_in_getPPCData ", error);
                throw error;
            }
        });
    }
    getReferenceMetaData(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let referenceGroupData = yield models_1.default.tbl_referenceGroup.findOne({
                    where: { name: name, isDeleted: 0 },
                    raw: true
                });
                if (referenceGroupData) {
                    let result = yield models_1.default.tbl_reference.findAll({
                        attributes: [
                            "id", "name", "description",
                            "referenceGroupId", "sortOrder",
                        ],
                        distinct: true,
                        model: models_1.default.tbl_reference,
                        where: {
                            isDeleted: Appconstants_1.default.ZERO,
                            referenceGroupId: referenceGroupData.id
                        },
                        required: true,
                        raw: true,
                        order: [['sortOrder', 'ASC']]
                    });
                    return result;
                }
                else
                    return Appconstants_1.default.INVALID_ID;
            }
            catch (error) {
                console.log("Error_in_getReferenceMetaData ", error);
                throw error;
            }
        });
    }
    getPPCAttributes(isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let attributes = [
                    [sequelize_1.Sequelize.literal('tbl_ppc.uniqueKey'), 'ppcId'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_ppc.plantSelected,'#','')" : 'tbl_ppc.plantSelected'}`), 'plantSelected'],
                    // [Sequelize.literal('tbl_ppc.pressAllocationRefId'), 'pressAllocationRefId'],
                    [sequelize_1.Sequelize.literal(`(select tr.name 
                    from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 9 
                        and tr.id = tbl_ppc.pressAllocationRefId)`), 'pressAllocation'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.plannedQty'), 'plannedQty'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_ppc.plannedInternalAlloy,'#','')" : 'tbl_ppc.plannedInternalAlloy'}`), 'plannedInternalAlloy'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.plannedNoOfBilletAndLength'), 'plannedNoOfBilletAndLength'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.productionRateRequired'), 'productionRateRequired'],
                    [sequelize_1.Sequelize.literal(`(select tr.name 
                    from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 1 
                        and tr.id = tbl_ppc.plannedQuenching)`), 'plannedQuenching'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.frontEndCoringLength'), 'frontEndCoringLength'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.backEndCoringLength'), 'backEndCoringLength'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.plantExtrusionLength'), 'plantExtrusionLength'],
                    // [Sequelize.literal('tbl_ppc.extrusionLengthRefId'), 'extrusionLengthRefId'],
                    [sequelize_1.Sequelize.literal(`(select tr.name 
                    from ${Appconstants_1.default.DB_JINDAL}.dbo.${Appconstants_1.default.TBL_REFERENCE} tr
                    where tr.isDeleted = 0 and tr.referenceGroupId = 2 
                        and tr.id = tbl_ppc.extrusionLengthRefId)`), 'extrusionLength'],
                    [sequelize_1.Sequelize.literal('tbl_ppc.plannedButtThickness'), 'plannedButtThickness'],
                    [sequelize_1.Sequelize.literal(`
                    (case when tbl_ppc.cutBilletsRefId = 1 then 'Yes'
                        when tbl_ppc.cutBilletsRefId = 2 then 'No'
                        else null
                    end)`),
                        "cutBillets"],
                    [sequelize_1.Sequelize.literal('tbl_ppc.buttWeightPerInch'), "buttWeightPerInch"],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_ppc.remarks,'#','')" : 'tbl_ppc.remarks'}`), "ppcRemarks"],
                ];
                return attributes;
            }
            catch (error) {
                console.log("Error_in_getPPCAttributes ", error);
                throw error;
            }
        });
    }
    getPPCIncludes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_ppc,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                    },
                    required: false,
                    raw: true
                };
                return includes;
            }
            catch (error) {
                console.log("Error_in_getPPCIncludes ", error);
                throw error;
            }
        });
    }
    getPPCFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let ppcFilter = {
                '$[tbl_ppc].plantSelected$': sequelize_1.Sequelize.literal(`
                    (isnull([tbl_ppc].[plantSelected], '') LIKE N'%${input["fplantSelected"]}%')
                    `),
                '$[tbl_ppc].pressAllocationRefId$': sequelize_1.Sequelize.literal(`
                    (isnull([tbl_ppc].[pressAllocationRefId], 0) LIKE N'%${input["fpressAllocation"]}%')
                    `),
                '$[tbl_ppc].plannedQty$': sequelize_1.Sequelize.literal(`
                    (isnull([tbl_ppc].[plannedQty], 0) LIKE N'%${input["fplannedQty"]}%')
                    `),
                '$[tbl_ppc].plannedInternalAlloy$': sequelize_1.Sequelize.literal(`
                    (isnull([tbl_ppc].[plannedInternalAlloy], '') LIKE N'%${input["fplannedInternalAlloy"]}%')
                    `),
                // '$[tbl_ppc].plannedNoOfBilletAndLength$': Sequelize.literal(`
                //     ([tbl_ppc].[plannedNoOfBilletAndLength] LIKE N'%${input["fplannedNoOfBilletAndLength"]}%' OR 1=1 )
                // `),
                '$[tbl_ppc].productionRateRequired$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[productionRateRequired],0) LIKE N'%${input["fproductionRateRequired"]}%' )
            `),
                '$[tbl_ppc].plannedQuenching$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[plannedQuenching],0) LIKE N'%${input["fplannedQuenching"]}%' )
            `),
                '$[tbl_ppc].frontEndCoringLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[frontEndCoringLength],0) LIKE N'%${input["ffrontEndCoringLength"]}%' )
            `),
                '$[tbl_ppc].backEndCoringLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[backEndCoringLength],0) LIKE N'%${input["fbackEndCoringLength"]}%' )
            `),
                '$[tbl_ppc].plantExtrusionLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[plantExtrusionLength],0) LIKE N'%${input["fplantExtrusionLength"]}%' )
            `),
                '$[tbl_ppc].extrusionLengthRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[extrusionLengthRefId],0) LIKE N'%${input["fextrusionLengthRefId"]}%' )
            `),
                '$[tbl_ppc].plannedButtThickness$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[plannedButtThickness],0) LIKE N'%${input["fplannedButtThickness"]}%' )
            `),
                '$[tbl_ppc].cutBilletsRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[cutBilletsRefId],0) LIKE N'%${input["fcutBilletsRefId"]}%' )
            `),
                '$[tbl_ppc].buttWeightPerInch$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[buttWeightPerInch],0) LIKE N'%${input["fbuttWeightPerInch"]}%' )
            `),
                '$[tbl_ppc].remarks$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_ppc].[remarks],'') LIKE N'%${input["fppcRemarks"]}%' )
            `),
            };
            return ppcFilter;
        });
    }
    updateOrderPriority(input, orderId, userId, roleId, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("into the updateOrderPriority");
                let orderObj = new models_1.default.tbl_order();
                orderObj.id = orderId;
                orderObj.priorityRefId = input["priorityRefId"];
                if (roleId == Appconstants_1.default.ONE) {
                    orderObj.updatedAdminId = userId;
                    orderObj.adminUpdatedOn = new Date(new Date().toUTCString());
                }
                else {
                    orderObj.updatedBy = userId;
                    orderObj.updatedOn = new Date(new Date().toUTCString());
                }
                let result = yield this.createOrUpdateByModel(models_1.default.tbl_order, orderObj, tran);
                return result;
            }
            catch (error) {
                console.log("Error_in_updateOrderPriority" + error);
                throw error;
            }
        });
    }
    getOrderUserMappingIncludes(input, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_orderUserMapping,
                    where: {
                        isActive: Appconstants_1.default.ONE,
                        isDeleted: Appconstants_1.default.ZERO,
                        userId: sequelize_1.Sequelize.literal(`tbl_orderUserMappings.userId = tbl_order.updatedBy`)
                    },
                    required: false,
                    subQuery: false,
                    raw: true
                };
                // if (role.Admin == currentUser["roleId"]) {
                //     delete includes.where.userId
                // }
                return includes;
            }
            catch (error) {
                console.log("Error_in_getOrderUserMappingIncludes ", error);
                throw error;
            }
        });
    }
    getPPCBilletWeight(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId
                };
                let query = yield models_1.default.tbl_ppc.findOne({
                    attributes: [
                        "buttWeightPerInch"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_ppc,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                return query;
            }
            catch (error) {
                console.log("Error_in_getPPCBilletWeight ", error);
                throw error;
            }
        });
    }
};
PpcService = __decorate([
    (0, typedi_1.Service)()
], PpcService);
exports.PpcService = PpcService;
//# sourceMappingURL=PpcService.js.map