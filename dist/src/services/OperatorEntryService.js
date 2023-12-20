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
exports.OperatorEntryService = void 0;
const typedi_1 = require("typedi");
const BaseService_1 = __importDefault(require("./BaseService"));
const models_1 = __importDefault(require("../../models"));
const Appconstants_1 = __importDefault(require("../constants/Appconstants"));
const Utils_1 = require("../utils/Utils");
const sequelize_1 = require("sequelize");
const Enums_1 = require("../enums/Enums");
let OperatorEntryService = class OperatorEntryService extends BaseService_1.default {
    getModel() {
        return models_1.default.tbl_operatorEntry;
    }
    createOrUpdateOperatorEntryData(input, currentUser, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let orderData = yield this.findUniqueKey(models_1.default.tbl_order, input["orderId"]);
                let operatorEntryData;
                if (orderData) {
                    let operatorEntryDataObj = new models_1.default.tbl_operatorEntry();
                    operatorEntryDataObj.orderId = orderData.id;
                    operatorEntryDataObj.dieTrialRefId = input["dieTrialRefId"];
                    operatorEntryDataObj.dieWithAluminiumRefId = input["dieWithAluminiumRefId"];
                    operatorEntryDataObj.previousDayDie_continueRefId = input["previousDayDie_continueRefId"];
                    operatorEntryDataObj.batchNo = input["batchNo"];
                    operatorEntryDataObj.actualInternalAlloy = input["actualInternalAlloy"];
                    operatorEntryDataObj.startTime = (0, Utils_1.isValueOrUndefined)(input["startTime"]);
                    operatorEntryDataObj.endTime = (0, Utils_1.isValueOrUndefined)(input["endTime"]);
                    operatorEntryDataObj.processTime = (0, Utils_1.isValueOrUndefined)(input["processTime"]);
                    operatorEntryDataObj.noOfBilletAndLength = input["noOfBilletAndLength"] ? JSON.stringify(input["noOfBilletAndLength"]) : undefined;
                    operatorEntryDataObj.actualButtThickness = (0, Utils_1.isValueOrUndefined)(input["actualButtThickness"]);
                    operatorEntryDataObj.breakThroughPressure = input["breakThroughPressure"];
                    operatorEntryDataObj.pushOnBilletLength = input["pushOnBilletLength"] != null ? input["pushOnBilletLength"] : undefined;
                    operatorEntryDataObj.pushQtyInKgs = input["pushQtyInKgs"];
                    operatorEntryDataObj.actualProductionRate = input["actualProductionRate"] != null ? input["actualProductionRate"] : undefined;
                    operatorEntryDataObj.buttWeightInKgs = input["buttWeightInKgs"] != null ? input["buttWeightInKgs"] : undefined;
                    operatorEntryDataObj.diefailRefId = input["diefailRefId"];
                    operatorEntryDataObj.dieFailureReason = input["dieFailureReason"];
                    operatorEntryDataObj.breakDown = input["breakDown"] ? JSON.stringify(input["breakDown"]) : undefined;
                    operatorEntryDataObj.breakDownDuration = (0, Utils_1.isValueOrUndefined)(input["breakDownDuration"]);
                    operatorEntryDataObj.logEndScrapLengthInMm = input["logEndScrapLengthInMm"];
                    operatorEntryDataObj.logEndScrapInKgs = input["logEndScrapInKgs"];
                    operatorEntryDataObj.operatorName = input["operatorName"];
                    operatorEntryDataObj.remarks = input["remarks"];
                    operatorEntryDataObj.isActive = input["isActive"];
                    operatorEntryDataObj.isDeleted = Appconstants_1.default.ZERO;
                    if (currentUser["roleId"] == Enums_1.role.Admin) {
                        operatorEntryDataObj.updatedAdminId = currentUser["id"];
                        operatorEntryDataObj.adminUpdatedOn = new Date(new Date().toUTCString());
                    }
                    // console.log("input[operatorId]", input);
                    if (input["operatorId"] != "" || (input["uniqueKey"] && input["uniqueKey"] != "")) {
                        let operatorId = input["operatorId"] ? input["operatorId"] : input["uniqueKey"];
                        operatorEntryData = operatorId != "" ? yield this.findUniqueKey(models_1.default.tbl_operatorEntry, operatorId) : undefined;
                    }
                    if (operatorEntryData) {
                        operatorEntryDataObj.id = operatorEntryData.id;
                        operatorEntryDataObj.uniqueKey = operatorEntryData.uniqueKey;
                        operatorEntryDataObj.updatedBy = currentUser["id"];
                        operatorEntryDataObj.updatedOn = new Date(new Date().toUTCString());
                    }
                    else {
                        operatorEntryDataObj.uniqueKey = (0, Utils_1.uuidv4)();
                        operatorEntryDataObj.createdBy = currentUser["id"];
                        operatorEntryDataObj.createdOn = new Date(new Date().toUTCString());
                    }
                    let result = yield this.createOrUpdateByModel(models_1.default.tbl_operatorEntry, operatorEntryDataObj, tran);
                    if (result) {
                        (currentUser["roleId"] == Enums_1.role.Admin) &&
                            (yield this.updateBundlingSupervisorDerivatives(orderData.id, operatorEntryDataObj.pushOnBilletLength, tran));
                        return {
                            "message": Appconstants_1.default.UPDATED_SUCCESSFULLY,
                            "uniqueKey": result.uniqueKey
                        };
                    }
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
    getOperatorEntryData(orderId, userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId,
                    // createdBy: userId
                };
                // (roleId == role.Admin || roleId > role.Operator_Entry) && delete whereCondition.createdBy
                let query = yield models_1.default.tbl_operatorEntry.findOne({
                    attributes: [
                        ["uniqueKey", 'operatorEntryId'],
                        "dieTrialRefId",
                        "dieWithAluminiumRefId",
                        "previousDayDie_continueRefId",
                        "batchNo", "actualInternalAlloy", "startTime", "endTime",
                        "processTime", "noOfBilletAndLength", "actualButtThickness", "breakThroughPressure",
                        "pushOnBilletLength", "pushQtyInKgs", "actualProductionRate", "buttWeightInKgs",
                        "diefailRefId",
                        "dieFailureReason", "breakDown", "breakDownDuration", "logEndScrapLengthInMm",
                        "logEndScrapInKgs", "operatorName", "remarks"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_operatorEntry,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                console.log("query", query);
                return query;
            }
            catch (error) {
                console.log("Error_in_getOperatorEntryData " + error);
                throw error;
            }
        });
    }
    getOperatorEntryAttributes(isDownload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let attributes = [
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.uniqueKey'), 'operatorEntryId'],
                    [sequelize_1.Sequelize.literal(`
                    (case when tbl_operatorEntry.dieTrialRefId = 1 then 'Yes'
                        when tbl_operatorEntry.dieTrialRefId = 2 then 'No'
                        else null
                    end)`), 'dieTrial'],
                    [sequelize_1.Sequelize.literal(`
                (case when tbl_operatorEntry.dieWithAluminiumRefId = 1 then 'Yes'
                    when tbl_operatorEntry.dieWithAluminiumRefId = 2 then 'No'
                    else null
                end)`), 'dieWithAluminium'],
                    [sequelize_1.Sequelize.literal(`
                (case when tbl_operatorEntry.previousDayDie_continueRefId = 1 then 'Yes'
                    when tbl_operatorEntry.previousDayDie_continueRefId = 2 then 'No'
                    else null
                end)`), 'previousDayDie_continue'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.batchNo'), 'batchNo'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.actualInternalAlloy,'#','')" : 'tbl_operatorEntry.actualInternalAlloy'}`), 'actualInternalAlloy'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.startTime'), 'startTime'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.endTime'), 'endTime'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.processTime'), 'processTime'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.noOfBilletAndLength'), 'noOfBilletAndLength'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.actualButtThickness'), 'actualButtThickness'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.breakThroughPressure'), 'breakThroughPressure'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.pushOnBilletLength'), 'pushOnBilletLength'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.pushQtyInKgs'), 'pushQtyInKgs'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.actualProductionRate'), 'actualProductionRate'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.buttWeightInKgs'), 'buttWeightInKgs'],
                    [sequelize_1.Sequelize.literal(`
                (case when tbl_operatorEntry.diefailRefId = 1 then 'Yes'
                    when tbl_operatorEntry.diefailRefId = 2 then 'No'
                    else null
                end)`), 'diefail'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.dieFailureReason,'#','')" : 'tbl_operatorEntry.dieFailureReason'}`), 'dieFailureReason'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.breakDown'), 'breakDown'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.breakDownDuration'), 'breakDownDuration'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.logEndScrapLengthInMm'), 'logEndScrapLengthInMm'],
                    [sequelize_1.Sequelize.literal('tbl_operatorEntry.logEndScrapInKgs'), 'logEndScrapInKgs'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.operatorName,'#','')" : 'tbl_operatorEntry.operatorName'}`), 'operatorName'],
                    [sequelize_1.Sequelize.literal(`${isDownload ? "replace(tbl_operatorEntry.remarks,'#','')" : 'tbl_operatorEntry.remarks'}`), "operatorEntryRemarks"]
                ];
                return attributes;
            }
            catch (error) {
                console.log("Error_in_getOperatorEntryAttributes ", error);
                throw error;
            }
        });
    }
    getOperatorEntryIncludes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let includes = {
                    attributes: [],
                    distinct: true,
                    model: models_1.default.tbl_operatorEntry,
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
                console.log("Error_in_getOperatorEntryIncludes ", error);
                throw error;
            }
        });
    }
    getOperatorEntryFilter(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let operatorEntryFilter = {
                '$[tbl_operatorEntry].dieTrialRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieTrialRefId],0) LIKE N'%${input["fdieTrialRefId"]}%' )
            `),
                '$[tbl_operatorEntry].dieWithAluminiumRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieWithAluminiumRefId],0) LIKE N'%${input["fdieWithAluminiumRefId"]}%' )
            `),
                '$[tbl_operatorEntry].previousDayDie_continueRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[previousDayDie_continueRefId],0) LIKE N'%${input["fpreviousDayDie_continueRefId"]}%' )
            `),
                '$[tbl_operatorEntry].batchNo$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[batchNo],0) LIKE N'%${input["fbatchNo"]}%' )
            `),
                '$[tbl_operatorEntry].actualInternalAlloy$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualInternalAlloy],'') LIKE N'%${input["factualInternalAlloy"]}%' )
            `),
                '$[tbl_operatorEntry].startTime$': sequelize_1.Sequelize.literal(`
                (CAST([tbl_operatorEntry].[startTime] as TIME) = CAST('${input["fstartTime"]}' as TIME))
            `),
                '$[tbl_operatorEntry].endTime$': sequelize_1.Sequelize.literal(`
                (CAST([tbl_operatorEntry].[endTime] as TIME) = CAST('${input["fendTime"]}' as TIME))
            `),
                // '$[tbl_operatorEntry].startTime$': Sequelize.literal(`
                //     (isnull([tbl_operatorEntry].[startTime],'') LIKE N'%${input["fstartTime"]}%' )
                // `),
                // '$[tbl_operatorEntry].endTime$': Sequelize.literal(`
                //     (isnull([tbl_operatorEntry].[endTime],'') LIKE N'%${input["fendTime"]}%' )
                // `),
                '$[tbl_operatorEntry].processTime$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[processTime],'') LIKE N'%${input["fprocessTime"]}%' )
            `),
                // '$[tbl_operatorEntry].noOfBilletAndLength$': Sequelize.literal(`
                //     ([tbl_operatorEntry].[processTime] LIKE N'%${input["fprocessTime"]}%' OR 1=1 )
                // `),
                '$[tbl_operatorEntry].actualButtThickness$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualButtThickness],0) LIKE N'%${input["factualButtThickness"]}%' )
            `),
                '$[tbl_operatorEntry].breakThroughPressure$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[breakThroughPressure],0) LIKE N'%${input["fbreakThroughPressure"]}%' )
            `),
                '$[tbl_operatorEntry].pushOnBilletLength$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[pushOnBilletLength],0) LIKE N'%${input["fpushOnBilletLength"]}%' )
            `),
                '$[tbl_operatorEntry].pushQtyInKgs$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[pushQtyInKgs],0) LIKE N'%${input["fpushQtyInKgs"]}%' )
            `),
                '$[tbl_operatorEntry].actualProductionRate$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[actualProductionRate],0) LIKE N'%${input["factualProductionRate"]}%' )
            `),
                '$[tbl_operatorEntry].buttWeightInKgs$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[buttWeightInKgs],0) LIKE N'%${input["fbuttWeightInKgs"]}%' )
            `),
                '$[tbl_operatorEntry].diefailRefId$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[diefailRefId],0) LIKE N'%${input["fdiefailRefId"]}%' )
            `),
                '$[tbl_operatorEntry].dieFailureReason$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[dieFailureReason],'') LIKE N'%${input["fdieFailureReason"]}%' )
            `),
                // '$[tbl_operatorEntry].breakDown$': {
                //     [Op.like]: '%' + input["fbreakDown"] + '%'
                // },
                '$[tbl_operatorEntry].breakDownDuration$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[breakDownDuration],'') LIKE N'%${input["fbreakDownDuration"]}%' )
            `),
                '$[tbl_operatorEntry].logEndScrapLengthInMm$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[logEndScrapLengthInMm],0) LIKE N'%${input["flogEndScrapLengthInMm"]}%' )
            `),
                '$[tbl_operatorEntry].logEndScrapInKgs$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[logEndScrapInKgs],0) LIKE N'%${input["flogEndScrapInKgs"]}%' )
            `),
                '$[tbl_operatorEntry].operatorName$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[operatorName],'') LIKE N'%${input["foperatorName"]}%' )
            `),
                '$[tbl_operatorEntry].remarks$': sequelize_1.Sequelize.literal(`
                (isnull([tbl_operatorEntry].[remarks],'') LIKE N'%${input["foperatorEntryRemarks"]}%' )
            `),
            };
            input["fstartTime"] == '' ? delete operatorEntryFilter['$[tbl_operatorEntry].startTime$'] : undefined;
            input["fendTime"] == '' ? delete operatorEntryFilter['$[tbl_operatorEntry].endTime$'] : undefined;
            return operatorEntryFilter;
        });
    }
    concatBreakDown(breakDown) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let text = "";
                if ((0, Utils_1.isArrayPopulated)(breakDown)) {
                    (breakDown || []).map((e, index) => {
                        text += `${e === null || e === void 0 ? void 0 : e.startTime} - ${e === null || e === void 0 ? void 0 : e.endTime}, ${e === null || e === void 0 ? void 0 : e.reason.replace(/#/g, '')}, ${e === null || e === void 0 ? void 0 : e.responsibleDepartment.replace(/#/g, '')} ${index != breakDown.length - 1 ? " | " : ""}`;
                    });
                }
                return text;
                // let result = '';
                // for (let data of breakDown) {
                //     if (result.length > 0)
                //         result = result + ' | ' + data["startTime"] + " - " + data["endTime"]
                //             + " - " + data["reason"] + " - " + data["responsibleDepartment"]
                //     else
                //         result = data["startTime"] + " - " + data["endTime"]
                //             + " - " + data["reason"] + " - " + data["responsibleDepartment"]
                // }
                // return result;
            }
            catch (error) {
                console.log("Error_in_concatBreakDown ", error);
                throw error;
            }
        });
    }
    concatBilletAndLength(billet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let billetString = '';
                (billet || []).map((e, index) => {
                    billetString += `Batch${index + 1}: ${e === null || e === void 0 ? void 0 : e.noOfBillet} Billets, ${e === null || e === void 0 ? void 0 : e.billetLength} ${index != billet.length - 1 ? " - " : ""}`;
                });
                let total = billet === null || billet === void 0 ? void 0 : billet.reduce((total, x) => total + parseInt(x === null || x === void 0 ? void 0 : x.noOfBillet), 0);
                billetString += ` Total Billets - ${!isNaN(total) ? total : 0}`;
                // console.log("billetString ", billetString)
                // let result = '', i = 1;
                // for (let data of billet) {
                //     if (result.length > 0)
                //         result = result + ' | ' + `${"Billet" + i}: ${data["billet"]}`
                //     else
                //         result = `${"Billet" + i}: ${data["billet"]}`
                //     i++;
                // }
                return billetString;
            }
            catch (error) {
                console.log("Error_in_concatBilletAndLength ", error);
                throw error;
            }
        });
    }
    getOperatorEntryPushOnBillet(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let whereCondition = {
                    isActive: Appconstants_1.default.ONE,
                    isDeleted: Appconstants_1.default.ZERO,
                    orderId: orderId,
                };
                let query = yield models_1.default.tbl_operatorEntry.findOne({
                    attributes: [
                        "pushOnBilletLength"
                    ],
                    distinct: true,
                    model: models_1.default.tbl_operatorEntry,
                    where: whereCondition,
                    required: true,
                    raw: true
                });
                console.log("query", query);
                return query;
            }
            catch (error) {
                console.log("Error_in_getOperatorEntryPushOnBillet " + error);
                throw error;
            }
        });
    }
    updateDerivativeFields(orderId, buttWeightPerInch, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let operatorEntryData = yield this.findByKey(models_1.default.tbl_operatorEntry, 'orderId', orderId);
                if (operatorEntryData) {
                    if (operatorEntryData.noOfBilletAndLength) {
                        let pushOnBillet = JSON.parse(operatorEntryData.noOfBilletAndLength).reduce(((total, x) => {
                            let billetVal = Number(x === null || x === void 0 ? void 0 : x.noOfBillet) * parseFloat(x === null || x === void 0 ? void 0 : x.billetLength) * Number(buttWeightPerInch);
                            return total + billetVal;
                        }), 0);
                        let totalBillet = JSON.parse(operatorEntryData.noOfBilletAndLength).reduce(((total, x) => total + Number(x === null || x === void 0 ? void 0 : x.noOfBillet)), 0);
                        let buttWeightInKgs = (Number(buttWeightPerInch) * Number(operatorEntryData === null || operatorEntryData === void 0 ? void 0 : operatorEntryData.actualButtThickness)) * Number(totalBillet);
                        let time = (0, Utils_1.findDuration)(operatorEntryData === null || operatorEntryData === void 0 ? void 0 : operatorEntryData.startTime, operatorEntryData === null || operatorEntryData === void 0 ? void 0 : operatorEntryData.endTime);
                        let breakDownTime = 0;
                        if (operatorEntryData.breakDown) {
                            for (let item of JSON.parse(operatorEntryData.breakDown)) {
                                let value = item.elapsedTime.split(" ")[0];
                                breakDownTime += Number(value);
                            }
                        }
                        let ActualProductionRate = ((pushOnBillet * 60) / (Number(time[1]) - Number(breakDownTime))).toFixed(4);
                        let operatorEntryDataObj = new models_1.default.tbl_operatorEntry();
                        operatorEntryDataObj.id = operatorEntryData.id;
                        operatorEntryDataObj.pushOnBilletLength = pushOnBillet;
                        operatorEntryDataObj.actualProductionRate = (!Number.isNaN(ActualProductionRate) && ActualProductionRate != "Infinity") ? ActualProductionRate : Appconstants_1.default.ZERO;
                        operatorEntryDataObj.buttWeightInKgs = buttWeightInKgs;
                        yield this.createOrUpdateByModel(models_1.default.tbl_operatorEntry, operatorEntryDataObj, tran);
                        yield this.updateBundlingSupervisorDerivatives(orderId, pushOnBillet, tran);
                    }
                }
            }
            catch (error) {
                console.log("Error_in_updateDerivativeFields " + error);
                throw error;
            }
        });
    }
    updateBundlingSupervisorDerivatives(orderId, pushOnBillet, tran) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bundlingSupervisorData = yield this.findByKey(models_1.default.tbl_bundlingSupervisor, 'orderId', orderId);
                if (bundlingSupervisorData) {
                    let recovery = (((bundlingSupervisorData === null || bundlingSupervisorData === void 0 ? void 0 : bundlingSupervisorData.finishQuantity) / pushOnBillet) * 100).toFixed(4);
                    let bundlingSupervisorObj = new models_1.default.tbl_bundlingSupervisor();
                    bundlingSupervisorObj.id = bundlingSupervisorData.id;
                    bundlingSupervisorObj.recovery = recovery;
                    yield this.createOrUpdateByModel(models_1.default.tbl_bundlingSupervisor, bundlingSupervisorObj, tran);
                }
            }
            catch (error) {
                console.log("Error_in_updateBundlingSupervisorDeviates " + error);
                throw error;
            }
        });
    }
};
OperatorEntryService = __decorate([
    (0, typedi_1.Service)()
], OperatorEntryService);
exports.OperatorEntryService = OperatorEntryService;
//# sourceMappingURL=OperatorEntryService.js.map