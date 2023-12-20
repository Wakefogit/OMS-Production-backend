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
exports.BundlingSupervisorService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const Enums_1 = require("../enums/Enums");
const sequelize_1 = require("sequelize");
let BundlingSupervisorService = class BundlingSupervisorService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_bundlingSupervisor;
    }
    createOrUpdatebundlingSupervisorData(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                let bundlingSupervisorData;
                if (orderData) {
                    let bundlingSupervisorObj = new models_1.default.tbl_bundlingSupervisor();
                    bundlingSupervisorObj.orderId = orderData.id;
                    bundlingSupervisorObj.finishQuantity = (0, Utils_1.isValueOrUndefined)(input["finishQuantity"]);
                    bundlingSupervisorObj.piecesPerBundle = input["piecesPerBundle"];
                    bundlingSupervisorObj.bundleWeight = input["bundleWeight"];
                    bundlingSupervisorObj.noOfBundles = input["noOfBundles"];
                    bundlingSupervisorObj.totalNoOfPieces = input["totalNoOfPieces"];
                    bundlingSupervisorObj.correctionQty = input["correctionQty"];
                    bundlingSupervisorObj.actualFrontEndCoringLength = input["actualFrontEndCoringLength"];
                    bundlingSupervisorObj.actualBackEndCoringLength = input["actualBackEndCoringLength"];
                    bundlingSupervisorObj.recovery = input["recovery"] != null ? input["recovery"] : undefined;
                    bundlingSupervisorObj.remarks = input["remarks"];
                    bundlingSupervisorObj.isActive = input["isActive"];
                    bundlingSupervisorObj.isDeleted = Appconstants_1.default.ZERO;
                    if (currentUser["roleId"] == Enums_1.role.Admin) {
                        bundlingSupervisorObj.updatedAdminId = currentUser["id"];
                        bundlingSupervisorObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    if (input["bundlingSupervisorId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                        let bundlingSupervisorId = input["bundlingSupervisorId"] ? input["bundlingSupervisorId"] : input["uniqueKey"];
                        bundlingSupervisorData = bundlingSupervisorId != "" ?
                            yield this.findUniqueKey(models_1.default.tbl_bundlingSupervisor, bundlingSupervisorId)
                            : undefined; //bundlingSupervisiorId
                    }
                    if (bundlingSupervisorData) {
                        bundlingSupervisorObj.id = bundlingSupervisorData.id;
                        bundlingSupervisorObj.uniqueKey = bundlingSupervisorData.uniqueKey;
                        bundlingSupervisorObj.updatedBy = currentUser["id"];
                        bundlingSupervisorObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        bundlingSupervisorObj.uniqueKey = (0, Utils_1.uuidv4)();
                        bundlingSupervisorObj.createdBy = currentUser["id"];
                        bundlingSupervisorObj.createdOn = new Date(new Date().toUTCString());
                    }
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_bundlingSupervisor, bundlingSupervisorObj, tran);
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
    getBundlingSupervisorData(orderId, userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId,
                    // createdBy: userId
                };
                // roleId == role.Admin && delete whereCondition.createdBy
                let query = yield models_1.default.tbl_bundlingSupervisor.findOne({
                    attributes: [
                        ["uniqueKey", 'bundlingSupervisorId'],
                        "finishQuantity", "piecesPerBundle", "bundleWeight", "noOfBundles",
                        "correctionQty", "totalNoOfPieces", "actualFrontEndCoringLength",
                        "actualBackEndCoringLength", "recovery", 'remarks'
                    ],
                    distinct: true,
                    model: models_1.default.tbl_bundlingSupervisor,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                return query;
            }
            catch (error) {
                console.log("Error_in_getBundlingSupervisorData " + error);
                throw error;
            }
        });
    }
    getBundlingSupervisorAttributes(isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let attributes = [
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.uniqueKey'), 'bundlingSupervisorId'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.finishQuantity'), 'finishQuantity'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.piecesPerBundle'), 'piecesPerBundle'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.bundleWeight'), 'bundleWeight'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.noOfBundles'), 'noOfBundles'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.totalNoOfPieces'), 'totalNoOfPieces'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.correctionQty'), 'correctionQty'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.actualFrontEndCoringLength'), 'actualFrontEndCoringLength'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.actualBackEndCoringLength'), 'actualBackEndCoringLength'],
                    [sequelize_1.Sequelize.literal('tbl_bundlingSupervisor.recovery'), 'recovery'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_bundlingSupervisor.remarks,'#','')" : 'tbl_bundlingSupervisor.remarks'}`), 'bundlingSupervisorRemarks'],
                ];
                return attributes;
            }
            catch (error) {
                console.log("Error_in_getBundlingSupervisorAttributes ", error);
                throw error;
            }
        });
    }
    getBundlingSupervisorIncludes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_bundlingSupervisor,
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
                console.log("Error_in_getBundlingSupervisorIncludes ", error);
                throw error;
            }
        });
    }
    getBundlingSupervisorFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let operatorEntryFilter = {
                '$[tbl_bundlingSupervisor].finishQuantity$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[finishQuantity],0) LIKE N'%${input["ffinishQuantity"]}%' )
            `),
                '$[tbl_bundlingSupervisor].piecesPerBundle$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[piecesPerBundle],0) LIKE N'%${input["fpiecesPerBundle"]}%' )
            `),
                '$[tbl_bundlingSupervisor].bundleWeight$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[bundleWeight],0) LIKE N'%${input["fbundleWeight"]}%' )
            `),
                '$[tbl_bundlingSupervisor].noOfBundles$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[noOfBundles],0) LIKE N'%${input["fnoOfBundles"]}%' )
            `),
                '$[tbl_bundlingSupervisor].totalNoOfPieces$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[totalNoOfPieces],0) LIKE N'%${input["ftotalNoOfPieces"]}%' )
            `),
                '$[tbl_bundlingSupervisor].correctionQty$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[correctionQty],0) LIKE N'%${input["fcorrectionQty"]}%' )
            `),
                '$[tbl_bundlingSupervisor].actualFrontEndCoringLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[actualFrontEndCoringLength],0) LIKE N'%${input["factualFrontEndCoringLength"]}%' )
            `),
                '$[tbl_bundlingSupervisor].actualBackEndCoringLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[actualBackEndCoringLength],0) LIKE N'%${input["factualBackEndCoringLength"]}%' )
            `),
                '$[tbl_bundlingSupervisor].recovery$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[recovery],0) LIKE N'%${input["frecovery"]}%' )
            `),
                '$[tbl_bundlingSupervisor].remarks$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_bundlingSupervisor].[remarks],'') LIKE N'%${input["fbundlingSupervisorRemarks"]}%' )
            `),
            };
            return operatorEntryFilter;
        });
    }
};
BundlingSupervisorService = __decorate([
    (0, typedi_1.Service)()
], BundlingSupervisorService);
exports.BundlingSupervisorService = BundlingSupervisorService;
//# sourceMappingURL=BundlingSupervisorService.js.map